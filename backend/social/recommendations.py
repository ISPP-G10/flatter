import math
from datetime import datetime
from authentication.models import FlatterUser
from sklearn.metrics.pairwise import euclidean_distances


def user_age(birthday):
    if birthday:
        birthdate = birthday
    else:
        return None

    today = datetime.now()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))


def jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    if union == 0:
        return 1.0
    else:
        return intersection / union




def build_similarity_matrix(users, user_login):
    # Inicializar la matriz de similitud
    similarity_list = dict()

    # Calcular la similitud entre los conjuntos de etiquetas de cada par de usuarios

    for user in users:
        tags1 = user_login.tags.all()
        tags2 = user.tags.all()
        similarity_tags = jaccard_similarity(set(tags1), set(tags2))
        if user_login.birthday and user.birthday:

            age1 = user_age(user_login.birthday)
            age2 = user_age(user.birthday)
            dist_euc = int(euclidean_distances([[age1]], [[age2]])[0][0])
            dist_norm = dist_euc / 100
            similitud_age = math.exp(-1 *  dist_norm)
            similarity_total = similarity_tags*0.7 + similitud_age*0.3
        else:
            similarity_total = similarity_tags

        similarity_list[user.id] = similarity_total


    return similarity_list


def recommend_similar_users(similarity_matrix, n=10):


    # Obtener los usuarios más similares
    similar_users = sorted(similarity_matrix.items(), key=lambda x: x[1], reverse=True)[:n]
    # Crear una lista de usuarios similares con sus respectivas puntuaciones de similitud
    return [FlatterUser.objects.get(id=tuple[0]) for tuple in similar_users]




