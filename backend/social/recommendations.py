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
    return intersection / union




def build_similarity_matrix(users):
    # Inicializar la matriz de similitud
    similarity_matrix = {}
    for user1 in users:
        similarity_matrix[user1.id] = {}
        for user2 in users:
            similarity_matrix[user1.id][user2.id] = 0

    # Calcular la similitud entre los conjuntos de etiquetas de cada par de usuarios
    for i, user1 in enumerate(users):
        for j, user2 in enumerate(users):
            if i < j:
                tags1 = user1.tags.all()
                tags2 = user2.tags.all()
                similarity_tags = jaccard_similarity(set(tags1), set(tags2))
                if user1.birthday and user2.birthday:

                    age1 = user_age(user1.birthday)
                    age2 = user_age(user2.birthday)
                    dist_euc = int(euclidean_distances([[age1]], [[age2]])[0][0])
                    dist_norm = dist_euc / 100
                    similitud_age = math.exp(-1 *  dist_norm)
                    similaruty_total = similarity_tags*0.7 + similitud_age*0.3
                else:
                    similaruty_total = similarity_tags

                similarity_matrix[user1.id][user2.id] = similaruty_total
                similarity_matrix[user2.id][user1.id] = similaruty_total

    return similarity_matrix


def recommend_similar_users(user_id, similarity_matrix, n=10):
    # Obtener el objeto de usuario correspondiente al user_id
    user = FlatterUser.objects.get(id=user_id)

    # Excluir al usuario de la lista de recomendaciones
    similarity_matrix[user_id].pop(user_id)


    # Obtener los usuarios más similares
    similar_users = sorted(similarity_matrix[user_id].items(), key=lambda x: x[1], reverse=True)[:n]
    # Crear una lista de usuarios similares con sus respectivas puntuaciones de similitud
    recommended_users = []
    for user_id, similarity_score in similar_users:
        recommended_users.append(FlatterUser.objects.get(id=user_id))

    return recommended_users



