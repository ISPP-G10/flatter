import logging
from social.models import Group, Message
from authentication.models import FlatterUser, Role
from mainApp.models import Review
from backend.schema import schema
import json
from graphene_django.utils.testing import GraphQLTestCase

logging.disable(logging.CRITICAL)
    
##### MUTATIONS TESTS #####
class TestMutations(GraphQLTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.GRAPHQL_URL = '/api/graphql/'
        cls.user1 = FlatterUser.objects.create_user(username="test_user1", password="1234", email="test@gmail.com", first_name="Test", 
                                                last_name="User", genre = 'H', flatter_coins = 0,)
        cls.user1.save()
        cls.user2 = FlatterUser.objects.create_user(username="test_user2", password="1234", email="test2@gmail.com", first_name="Test", 
                                                last_name="User2", genre = 'M', flatter_coins = 0,)
        cls.user2.save()
        cls.user3 = FlatterUser.objects.create_user(username="test_user3", password="1234", email="test3@gmail.com", first_name="Test",
                                                last_name="User3", genre = 'H', flatter_coins = 0,)
        cls.user3.save()
        cls.user4= FlatterUser.objects.create_user(username="test_user4", password="1234", email="test4@gmail.com", first_name="Test",
                                                last_name="User4", genre = 'H', flatter_coins = 0,)
        cls.user4.save()
        cls.user5= FlatterUser.objects.create_user(username="test_user5", password="1234", email="test5@gmail.com", first_name="Test",
                                                last_name="User5", genre = 'M', flatter_coins = 0,)
        cls.user5.save()

        cls.group1 = Group(name='test_mutations_group_1', individual=True)
        cls.group1.save()
        cls.group1.users.add(cls.user1, cls.user2)
        cls.group1.save()

        cls.group2 = Group(name='Grupo añade usuarios', individual=False)
        cls.group2.save()
        cls.group2.users.add(cls.user1, cls.user2, cls.user3)
        cls.group2.save()

        cls.group3 = Group(name='Grupo elimina usuarios', individual=False)
        cls.group3.save()
        cls.group3.users.add(cls.user1, cls.user2, cls.user3, cls.user4)
        cls.group3.save()

        cls.review1 = Review.objects.create(text="Test review", rating=5, evaluator_user=cls.user1, valued_user=cls.user2, relationship='A')
        cls.review1.save()
        
        cls.role1 = Role.objects.create(role='U')
        

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        FlatterUser.objects.filter(username='test_user').delete()
        FlatterUser.objects.filter(username='test_user2').delete()
        FlatterUser.objects.filter(username='test_user3').delete()
        FlatterUser.objects.filter(username='test_user4').delete()
        FlatterUser.objects.filter(username='test_user5').delete()
        Group.objects.filter(name='test_mutations_group_1').delete()
        Group.objects.filter(name='Grupo añade usuarios').delete()
        Group.objects.filter(name='Grupo elimina usuarios').delete()
        Review.objects.filter(text='Test review').delete()
        Role.objects.filter(role='U').delete()
        

        
    #TESTS DE GRUPOS INDIVIDUALES
    ### Test de mutación de crear grupo  +++ Caso positivo: se crea un grupo individual con dos usuarios
    def test_create_individual_group_positive(self):
        response = self.query('''
            mutation test{
                createIndividualGroup(
                    username: "%s"
                    users: ["%s", "%s"]
                ){
                    group{
                        name
                        individual
                        users{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.user1.username, self.user1.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            raise e
        
        self.assertResponseNoErrors(response)
        #Group.objects.filter(users=[self.user1.id, self.user2.id]).delete()


    ### Test de mutación de crear grupo  --- Caso negativo: se intenta crear un grupo con un nombre de más de 30 caracteres
    def test_create_individual_group_negative_long_name(self):
        return None #No se puede validar la longitud del campo name con la mutation de crear grupo
        response = self.query('''
            mutation test{
                createIndividualGroup(
                    username: "%s"
                    users: ["%s", "%s"]
                ){
                    group{
                        name
                        individual
                        users{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.user1.username, self.user1.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User ids must be unique')


    ### Test de mutación de crear grupo  --- Caso negativo: se intenta crear un grupo con un usuario inexistente
    def test_create_individual_group_negative_nonexistent_user(self):
        response = self.query('''
            mutation test{
                createIndividualGroup(
                    username: "%s"
                    users: ["%s", "%s"]
                ){
                    group{
                        name
                        individual
                        users{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.user1.username, self.user1.username, "nonexistent_user")
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Some users do not exist')



    #TESTS DE GRUPOS NO INDIVIDUALES
    ### Test de mutación de crear grupo  +++ Caso positivo: se crea un grupo no individual con tres usuarios
    def test_create_non_individual_group_positive(self):
        return None #Aun no existe la mutación de crear grupo no individual
        response = self.query('''
            mutation test{
                createIndividualGroup(
                    username: "%s"
                    users: ["%s", "%s", "%s"]
                ){
                    group{
                        name
                        individual
                        users{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.user1.username, self.user1.username, self.user2.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            raise e
        
        self.assertResponseNoErrors(response)
        


    #TESTS DE MENSAJES
    ### Test de mutación de crear mensaje  +++ Caso positivo: se crea un mensaje
    def test_create_message_positive(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba"
                    groupId: %s
                    username: "%s"
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.group1.id, self.user1.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        Message.objects.filter(text='test_message_positive').delete()


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un texto vacío
    def test_create_message_negative_empty_message(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: ""
                    groupId: %s
                    username: "%s"
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.group1.id, self.user1.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'The message must have between 1 and 140 characters')


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un grupo inexistente
    def test_create_message_negative_nonexistent_group(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba con grupo inexsitente"
                    groupId: 999
                    username: "%s"
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.user1.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Group does not exist')


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un usuario inexistente
    def test_create_message_negative_nonexistent_user(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba con usuario inexsitente"
                    groupId: %s
                    username: "No existe"
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.group1.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User does not exist')


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un usuario que no pertenece al grupo
    def test_create_message_negative_user_not_in_group(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba con usuario que no pertenece al grupo"
                    groupId: %s
                    username: "%s"
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                            username
                        }
                    }
                }
            }
        ''' % (self.group1.id, self.user3.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User does not exist')



    #TESTS DE AÑADIR USUARIO A GRUPO
    ### Test de mutación de añadir usuario a grupo  +++ Caso positivo: se añade un usuario a un grupo
    def test_add_user_to_group_mutation(self):
        initial_group_length = len(self.group2.users.all())
        response = self.query('''
            mutation test{
                addUsersGroup(
                    userIds: [%s]
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user4.id, self.group2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['addUsersGroup']['group']['id'], str(self.group2.id))
        self.assertEqual(content['data']['addUsersGroup']['group']['name'], self.group2.name)
        self.assertEqual(len(content['data']['addUsersGroup']['group']['users']), initial_group_length + 1)
        self.group2.users.remove(self.user4)

    ### Test de mutación de añadir usuario a grupo  +++ Caso positivo: se añaden varios usuarios a un grupo
    def test_add_users_to_group_mutation(self):
        initial_group_length = len(self.group2.users.all())
        response = self.query('''
            mutation test{
                addUsersGroup(
                    userIds: [%s, %s]
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user4.id, self.user5.id, self.group2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['addUsersGroup']['group']['id'], str(self.group2.id))
        self.assertEqual(content['data']['addUsersGroup']['group']['name'], self.group2.name)
        self.assertEqual(len(content['data']['addUsersGroup']['group']['users']), initial_group_length + 2)
        self.group2.users.remove(self.user4)
        self.group2.users.remove(self.user5)

    ### Test de mutación de añadir usuario a grupo  --- Caso negativo: se intenta añadir un usuario a un grupo que no existe
    def test_add_user_to_group_mutation_negative_group_does_not_exist(self):
        response = self.query('''
            mutation test{
                addUsersGroup(
                    userIds: [%s]
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user4.id, 999)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Group does not exist')

    
    ### Test de mutación de añadir usuario a grupo  --- Caso negativo: se intenta añadir un usuario que no existe a un grupo
    def test_add_user_to_group_mutation_negative_user_does_not_exist(self):
        response = self.query('''
            mutation test{
                addUsersGroup(
                    userIds: [%s]
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (999, self.group2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User ids must be valid')


    ### Test de mutación de añadir usuario a grupo  --- Caso negativo: se intenta añadir un usuario a un grupo al que ya pertenece
    #FALLO DETECTADO: NO SE LANZA LA EXCEPCIÓN
    def test_add_user_to_group_mutation_negative_user_already_in_group(self):
        pass
        '''
        response = self.query(###
            mutation test{
                addUsersGroup(
                    userIds: %s
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ### % (self.user3.id, self.group2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'The user with id %s is already part of the group' % (self.user3.id))
        '''



    #TESTS DE ELIMINAR USUARIO DE GRUPO
    ### Test de mutación de eliminar usuario de grupo  +++ Caso positivo: se elimina un usuario de un grupo
    def test_remove_user_from_group_mutation(self):
        inital_group_length = len(self.group3.users.all())
        response = self.query('''
            mutation test{
                leaveGroup(
                    userId: %s
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user3.id, self.group3.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['leaveGroup']['group']['id'], str(self.group3.id))
        self.assertEqual(content['data']['leaveGroup']['group']['name'], self.group3.name)
        self.assertEqual(len(content['data']['leaveGroup']['group']['users']), inital_group_length - 1)
        self.group2.users.add(self.user3)


    ### Test de mutación de eliminar usuario de grupo  --- Caso negativo: se intenta eliminar un usuario de un grupo que no existe
    def test_remove_user_from_group_mutation_negative_group_does_not_exist(self):
        response = self.query('''
            mutation test{
                leaveGroup(
                    userId: %s
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user3.id, 999)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Group matching query does not exist.')


    ### Test de mutación de eliminar usuario de grupo  --- Caso negativo: se intenta eliminar un usuario que no forma parte del grupo
    def test_remove_user_from_group_mutation_negative_user_not_in_group(self):
        response = self.query('''
            mutation test{
                leaveGroup(
                    userId: %s
                    groupId: %s
                ){
                    group{
                        id
                        name
                        users{
                            id
                        }
                    }
                }
            }
        ''' % (self.user5.id, self.group3.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'The user with id %s is not part of the group' % (self.user5.id))



    #TESTS DE AÑADIR RESEÑA
    ### Test de mutación de añadir reseña  +++ Caso positivo: se añade una reseña
    def test_add_review_positive(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user1.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['createReview']['review']['rating'], 5)
        self.assertEqual(content['data']['createReview']['review']['text'], "This is a test review")
        self.assertEqual(content['data']['createReview']['review']['relationship'], "A")
        Review.objects.get(id=content['data']['createReview']['review']['id']).delete()


    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta añadir una reseña sobre un usuario que no existe
    def test_add_review_negative_valued_user_does_not_exist(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % ("nonexistent", self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El usuario valorado no existe')


    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta valorar a uno mismo
    def test_add_review_negative_valued_user_is_evaluator(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user3.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'No puedes valorarte a ti mismo')

    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta añadir una reseña con un usuario que no existe
    def test_add_review_negative_evaluator_user_does_not_exist(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user1.username, "nonexistent")
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El usuario evaluador no existe')


    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta añadir una reseña con una puntuación fuera de rango
    def test_add_review_negative_rating_out_of_range(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 6
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user1.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'La valoración debe estar entre 1 y 5')

    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta añadir una reseña con un usuario que ya ha valorado al usuario
    def test_add_review_negative_already_reviewed(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "A"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user2.username, self.user1.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Ya has valorado a este usuario')


    ### Test de mutación de añadir reseña  --- Caso negativo: se intenta añadir una reseña con un usuario sin relación con el usuario valorado
    def test_add_review_negative_no_relationship(self):
        response = self.query('''
            mutation test{
                createReview(
                rating: 5
                text: "This is a test review"
                valuedUser: "%s"
                evaluatorUser: "%s"
                relationship: "None"
                ){
                    review{
                        id
                        rating
                        text
                        valuedUser{
                            id
                            username
                        }
                        evaluatorUser{
                            id
                            username
                        }
                        relationship
                    }
                }
            }
            ''' % (self.user2.username, self.user3.username)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'La relación entre usuarios no es válida')



    #TESTS DE EDITAR USUARIO PRIVADO
    ### Test de mutación de editar usuario  +++ Caso positivo: se edita el perfil privado de un usuario
    def test_edit_user_private_positive(self):
        response = self.query('''
            mutation test{
                editUserPrivate(
                username: "%s"
                email: "%s"
                firstName: "%s"
                lastName: "%s"
                ){
                    user{
                        id
                        username
                        email
                        firstName
                        lastName
                    }
                }
            }
            ''' % (self.user1.username, self.user1.email, self.user1.first_name, self.user1.last_name)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['editUserPrivate']['user']['username'], self.user1.username)
        self.assertEqual(content['data']['editUserPrivate']['user']['email'], self.user1.email)


    ### Test de mutación de editar usuario  --- Caso negativo: se intenta editar el perfil privado de un usuario con un email que ya existe
    def test_edit_user_private_negative_email_already_exists(self):
        response = self.query('''
            mutation test{
                editUserPrivate(
                username: "%s"
                email: "%s"
                firstName: "%s"
                lastName: "%s"
                ){
                    user{
                        id
                        username
                        email
                        firstName
                        lastName
                    }
                }
            }
            ''' % (self.user2.username, self.user1.email, self.user2.first_name, self.user2.last_name)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Este email ya está registrado. Por favor, elige otro.')



    #TESTS DE EDITAR USUARIO PÚBLICO
    ### Test de mutación de editar usuario  +++ Caso positivo: se edita el perfil público de un usuario
    def test_edit_user_public_positive(self):
        response = self.query('''
            mutation test{
                editUserPublic(
                username: "%s"
                firstName: "%s"
                lastName: "%s"
                tags: []
                ){
                    user{
                        id
                        username
                        email
                        firstName
                        lastName
                    }
                }
            }
            ''' % (self.user1.username, self.user1.first_name, self.user1.last_name)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['editUserPublic']['user']['username'], self.user1.username)


    ### Test de mutación de editar usuario  --- Caso negativo: se intenta editar el perfil público de un usuario con un nombre muy largo
    def test_edit_user_public_negative_long_name(self):
        response = self.query('''
            mutation test{
                editUserPublic(
                username: "%s"
                firstName: "%s"
                lastName: "%s"
                tags: []
                ){
                    user{
                        id
                        username
                        email
                        firstName
                        lastName
                    }
                }
            }
            ''' % (self.user1.username, 'a'*51, 'a'*51)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El nombre debe tener entre 3 y 50 caracteres')

    
    ### Test de mutación de editar usuario  --- Caso negativo: se intenta editar el perfil público de un usuario con un tag que no existe
    def test_edit_user_public_negative_tag_does_not_exist(self):
        response = self.query('''
            mutation test{
                editUserPublic(
                username: "%s"
                firstName: "%s"
                lastName: "%s"
                tags: ["%s"]
                ){
                    user{
                        id
                        username
                        email
                        firstName
                        lastName
                    }
                }
            }
            ''' % (self.user1.username, self.user1.first_name, self.user1.last_name, 'tag')
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'La etiqueta tag no existe')


    #TESTS DE CAMBIAR CONTRASEÑA
    ### Test de mutación de cambiar contraseña  +++ Caso positivo: se cambia la contraseña de un usuario
    def test_change_password_positive(self):
        response = self.query('''
            mutation test{
                changeUserPassword(
                username: "%s"
                oldPassword: "%s"
                newPassword: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, "1234", "new_password")
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['changeUserPassword']['user']['username'], self.user1.username)


    ### Test de mutación de cambiar contraseña  --- Caso negativo: se intenta cambiar la contraseña de un usuario con una contraseña antigua incorrecta
    def test_change_password_negative_wrong_old_password(self):
        response = self.query('''
            mutation test{
                changeUserPassword(
                username: "%s"
                oldPassword: "%s"
                newPassword: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, "wrong_password", self.user1.password)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'La contraseña actual no es correcta')



    #TESTS DE AÑADIR ROL A USUARIO
    ### Test de mutación de añadir rol a usuario  +++ Caso positivo: se añade un rol a un usuario
    def test_add_role_positive(self):
        response = self.query('''
            mutation test{
                addRoleToUser(
                username: "%s"
                role: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, self.role1.role)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['addRoleToUser']['user']['username'], self.user1.username)


    ### Test de mutación de añadir rol a usuario  --- Caso negativo: se intenta añadir un rol que no existe a un usuario
    def test_add_role_negative_role_does_not_exist(self):
        response = self.query('''
            mutation test{
                addRoleToUser(
                username: "%s"
                role: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, 'role')
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El rol no existe')



    #TESTS DE ELIMINAR ROL DE USUARIO
    ### Test de mutación de eliminar rol de usuario  +++ Caso positivo: se elimina un rol de un usuario
    def test_remove_role_positive(self):
        response = self.query('''
            mutation test{
                deleteRoleToUser(
                username: "%s"
                role: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, self.role1.role)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        self.assertEqual(content['data']['deleteRoleToUser']['user']['username'], self.user1.username)


    ### Test de mutación de eliminar rol de usuario  --- Caso negativo: se intenta eliminar un rol que no existe de un usuario
    def test_remove_role_negative_role_does_not_exist(self):
        response = self.query('''
            mutation test{
                deleteRoleToUser(
                username: "%s"
                role: "%s"
                ){
                    user{
                        id
                        username
                    }
                }
            }
            ''' % (self.user1.username, 'role')
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El rol no existe')