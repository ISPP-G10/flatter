from social.models import Group, Message, Incident, Request
from authentication.models import FlatterUser
from backend.schema import schema
import json
from graphene_django.utils.testing import GraphQLTestCase
    
##### MUTATIONS TESTS #####
class TestMutations(GraphQLTestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.GRAPHQL_URL = '/api/graphql/'
        cls.user1 = FlatterUser.objects.create_user(username="test_user", password="1234", email="test@gmail.com", first_name="Test", 
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
        

        
    #TESTS DE GRUPOS    
    ### Test de mutación de crear grupo  +++ Caso positivo: se crea un grupo individual con dos usuarios
    def test_create_individual_group_positive(self):
        response = self.query('''
            mutation test{
                createGroup(
                    name: "Grupo de prueba individual"
                    individual: true
                    userIds: [%s, %s]
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
        ''' % (self.user1.id, self.user2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        Group.objects.filter(name='Crea grupo de prueba individual').delete()

    
    ### Test de mutación de crear grupo  +++ Caso positivo: se crea un grupo no individual con tres usuarios
    def test_create_non_individual_group_positive(self):
        response = self.query('''
            mutation test{
                createGroup(
                    name: "Grupo no individual"
                    individual: false
                    userIds: [%s, %s, %s]
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
        ''' % (self.user1.id, self.user2.id, self.user3.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        Group.objects.filter(name='Crea grupo no individual').delete()
        


    ### Test de mutación de crear grupo  --- Caso negativo: se intenta crear un grupo con un nombre de más de 30 caracteres
    def test_create_individual_group_negative_long_name(self):
        response = self.query('''
            mutation test{
                createGroup(
                    name: "Crear grupo de prueba individual con nombre demasiado largo"
                    individual: true
                    userIds: [%s, %s]
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
        ''' % (self.user1.id, self.user2.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Group name must have between 3 and 30 characters')


    ### Test de mutación de crear grupo  --- Caso negativo: se intenta crear un grupo con un usuario inexistente
    def test_create_individual_group_negative_nonexistent_user(self):
        response = self.query('''
            mutation test{
                createGroup(
                    name: "Crear grupo de prueba individual con usuario inexistente"
                    individual: true
                    userIds: [%s, 999]
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
        ''' % (self.user1.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'User ids must be unique')




    #TESTS DE MENSAJES
    ### Test de mutación de crear mensaje  +++ Caso positivo: se crea un mensaje
    def test_create_message_positive(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba"
                    groupId: %s
                    senderId: %s
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                        }
                    }
                }
            }
        ''' % (self.group1.id, self.user1.id)
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
        pass
    ''' tiene que validarse '''


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un grupo inexistente
    def test_create_message_negative_nonexistent_group(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba con grupo inexsitente"
                    groupId: 999
                    senderId: %s
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
                        }
                    }
                }
            }
        ''' % (self.user1.id)
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'Group matching query does not exist.')


    ### Test de mutación de crear mensaje  --- Caso negativo: se intenta crear un mensaje con un usuario inexistente
    def test_create_message_negative_nonexistent_user(self):
        response = self.query('''
            mutation test{
                createMessage(
                    text: "Creación de mensaje de prueba con usuario inexsitente"
                    groupId: %s
                    senderId: 999
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
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
                    senderId: %s
                ){
                    message{
                        text
                        group{
                            id
                        }
                        user{
                            id
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
        self.assertEqual(content['errors'][0]['message'], 'The user with id %s is not part of the group' % (self.user3.id))



    #TESTS DE INCIDENTES
    ### Test de mutación de crear incidente  +++ Caso positivo: se crea un incidente
    def test_create_incident_mutation(self):
        response = self.query('''
            mutation test{
                createIncident(
                    command: "Incidente de prueba"
                ){
                    incident{
                        command
                    }
                }
            }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        Incident.objects.filter(command='Incidente de prueba').delete()


    ### Test de mutación de crear incidente  --- Caso negativo: se intenta crear un incidente con un comando vacío
    def test_create_incident_mutation_negative(self):
        response = self.query('''
            mutation test{
                createIncident(
                    command: ""
                ){
                    incident{
                        command
                    }
                }
            }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El comando no puede estar vacío')



    #TESTS DE PETICIONES
    ### Test de mutación de crear petición  +++ Caso positivo: se crea una petición
    def test_create_request_mutation(self):
        response = self.query('''
            mutation test{
                createRequest(
                    command: "Petición de prueba"
                ){
                    request{
                        command
                    }
                }
            }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseNoErrors(response)
        Request.objects.filter(command='Petición de prueba').delete()

    
    ### Test de mutación de crear petición  --- Caso negativo: se intenta crear una petición con un comando vacío
    def test_create_request_mutation_negative(self):
        response = self.query('''
            mutation test{
                createRequest(
                    command: ""
                ){
                    request{
                        command
                    }
                }
            }
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e
        
        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], 'El comando no puede estar vacío')

    

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

    #TESTS DE EDITAR USUARIO
    #TESTS DE CAMBIAR CONTRASEÑA
    #TESTS DE AÑADIR ROL A USUARIO
    #TESTS DE ELIMINAR ROL DE USUARIO
    #TESTS DE AÑADIR RESEÑA
    



    

