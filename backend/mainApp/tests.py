import json
import logging
from django.test import TestCase
from authentication.models import FlatterUser, Tag
from .models import Property, Petition
from backend.schema import schema
from graphene_django.utils.testing import GraphQLTestCase
from .types import Province, Municipality

logging.disable(logging.CRITICAL)

# Create your tests here.
# Tests de models.py
class TestProperty(TestCase):
    def setUp(self):
        self.user = FlatterUser.objects.create_user(
            username="Hola",
            password="1234",
            email="asd@asd.asd",
            first_name="A",
            last_name="B",
            genre='H',
            flatter_coins=0,
        )
        
        self.province = Province.objects.get(name="Sevilla")
        self.municipality = Municipality.objects.get(name="Sevilla")

        self.property = Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province=self.province,
            municipality=self.municipality,
            dimensions=200,
            owner=self.user,
            max_capacity=5,
        )

        self.petition = Petition.objects.create(
            message="Sé mi amigo",
            creation_at="2023-04-07",
            property=self.property,
            requester=self.user,
            status='P',
        )
    
    def test_createProperty(self):
        
        assert Property.objects.count() == 1
    
    def test_addTagToProperty(self):

        tag_1 = Tag.objects.create(name="Tag 1", entity="U")
        
        self.property.tags.add(tag_1)
        
        assert Property.objects.first().tags.count() == 1
    
    def test_updateProperty(self):
        
        self.property = Property.objects.update(
            title="Mi habitación",
            description="un día bonito",
        )

        assert Property.objects.get(title="Mi habitación")
    
    def test_deleteProperty(self):
        
        self.property = Property.objects.get(title="title")
        self.property.delete()

        assert Property.objects.count() == 0
    
    def test_MakePropertyOutstanding(self):
        
        self.property = Property.objects.update(
            is_outstanding=True
        )

        assert Property.objects.get(title="title").is_outstanding == True
    
    def test_CreatePetition(self):
         
         assert Petition.objects.count() == 1

#Tests de queries.py de inmueble
    def test_resolve_get_properties(self):
        query = '''
            query test{
                getProperties(userToken: " "){
                    province {
                        name
                    }
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors

    def test_resolve_get_property_by_title(self):
        query = '''
            query test{
                getPropertyByTitle(title: "title", userToken: " ") {
                    title
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_property_by_id(self):
        query = '''
            query test($id: Int!){
                getPropertyById(id: $id, userToken: " ") {
                    title
                    id
                }
            }
        '''
        result = schema.execute(query, variables={'id': self.property.id})
        assert not result.errors
    
    def test_resolve_get_all_tags(self):
        query = '''
            query test{
                getAllTags(userToken: " ") {
                    name
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_property_tags(self):
        query = '''
            query test($id: Int!){
                getPropertyTags(property: $id, userToken: " ") {
                    propertyTags{
                        title
                    }
                }
            }
        '''
        result = schema.execute(query, variables={'id': self.property.id})
        assert not result.errors
    
    def test_resolve_get_filtered_properties_by_price_and_city(self):
        query = '''
            query test{
                getFilteredPropertiesByPriceAndCity(minPrice: 90, maxPrice: 200, pageNumber:1, userToken: " ") {
                    totalCount
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_filtered_properties_by_price_and_city_max_price_invalid(self):
        try:
            query = '''
            query test{
                getFilteredPropertiesByPriceAndCity(minPrice: 90, maxPrice:20, pageNumber:1, userToken: " "){
                    totalCount
                }
            }
            '''
            schema.execute(query)
            self.fail("El precio máximo introducido es menor al mínimo")
        except AssertionError:
            pass

    def test_resolve_get_filtered_properties_by_price_and_city_municipality_invalid(self):
        try:
            query = '''
            query test{
                getFilteredPropertiesByPriceAndCity(municipality:"patata", userToken: " "){
                    title
                }
            }
            '''
            schema.execute(query)
            self.fail("El municipio introducido no existe")
        except AssertionError:
            pass

    def test_resolve_get_filtered_properties_by_price_and_city_province_invalid(self):
        try:
            query = '''
            query test{
                getFilteredPropertiesByPriceAndCity(province:"patata", userToken: " "){
                    title
                }
            }
            '''
            schema.execute(query)
            self.fail("La provincia introducida no existe")
        except AssertionError:
            pass

    def test_resolve_get_properties_by_owner(self):
        query = '''
            query test{
                getPropertiesByOwner(username: "Hola", userToken: " ") {
                   title
                   id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors

    def test_resolve_get_properties_by_owner_without_properties(self):
        quser = '''
            mutation testUser{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebesita"
                    username: "usuario"
                    password: "contraseña"
                    genre: "Hombre"
                    roles: "Owner"
                ){
                    user{
                        username
                        id
                    }
                }
            }
        '''
        try:
            query = '''
            query test{
                getPropertiesByOwner(username: "usuario", userToken: " ") {
                   title
                   id
                }
            }
            '''
            schema.execute(query)
            self.fail("El propietario no tiene ningún inmueble registrado")
        except AssertionError:
            pass

    def test_resolve_get_properties_by_owner_without_properties(self):
        quser = '''
            mutation testUser{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebesita"
                    username: "usuario2"
                    password: "contraseña"
                    genre: "Hombre"
                    roles: "Renter"
                ){
                    user{
                        username
                        id
                    }
                }
            }
        '''
        try:
            query = '''
            query test{
                getPropertiesByOwner(username: "usuario2", userToken: " ") {
                   title
                   id
                }
            }
            '''
            schema.execute(query)
            self.fail("El usuario no tiene el rol de propietario")
        except AssertionError:
            pass
        
    
    def test_resolve_get_outstanding_properties(self):
        self.property.is_outstanding = True
        query = '''
            query test{
                getOutstandingProperties(userToken: " ") {
                   title
                   id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_petitions_by_status_and_username_and_dates(self):
        query= '''
            query test{
                getPetitionsByStatusAndUsernameAndDates(username: "Hola", startDate:"2023-04-07", endDate:"2023-04-09", status:"P", userToken: " "){
                    status    
                } 
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_petitions_by_requester_and_status_and_dates(self):
        query= '''
            query test{
                getPetitionsByRequesterAndStatusAndDates(username: "Hola", startDate:"2023-04-07", endDate:"2023-04-09",
                status:"P", userToken: " "){
                    status    
                } 
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_petition_by_requester_to_property(self):
        query= '''
            query test($id: Int!){
                getPetitionByRequesterToProperty(username: "Hola", propertyId:$id, userToken: " "){
                    status    
                } 
            }
        '''
        result = schema.execute(query, variables={'id': self.property.id})
        assert not result.errors

    def test_resolve_get_favourite_properties(self):
        self.property.interested_users == True
        query= '''
            query test{
                getFavouriteProperties(username:"Hola", userToken: " "){
                    title
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_provinces(self):
        query= '''
            query test{
                getProvinces{
                    name
            	}
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_municipalities_by_province(self):
        query= '''
            query test{
                getMunicipalitiesByProvince(province:"Sevilla", userToken: " "){
                    municipality{
                        title
                    }
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors

# Tests de mutation.py de inmueble
class DefaultTests(GraphQLTestCase):

    def setUp(self):
        self.GRAPHQL_URL = '/api/graphql/'

class TestsMutations(DefaultTests):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = FlatterUser.objects.create_user(
            username="Hola",
            password="1234",
            email="asd@asd.asd",
            first_name="A",
            last_name="B",
            genre='H',
            flatter_coins=5000,
        )
        cls.quser = '''
            mutation testUser{
                createUser(
                    email: "e@e.com"
                    firstName: "Prueba"
                    lastName: "Pruebesita"
                    username: "usuario"
                    password: "contraseña"
                    genre: "Hombre"
                    roles: "Owner"
                    flatterCoins: 5000
                ){
                    user{
                        username
                        id
                    }
                }
            }
        '''
        schema.execute(cls.quser)

        cls.quser2 = '''
            mutation testUser{
                createUser(
                    email: "euler@e.com"
                    firstName: "Pruebado"
                    lastName: "Pruebesita"
                    username: "miguel"
                    password: "contraseña"
                    genre: "Hombre"
                    roles: "Owner"
                    flatterCoins: 5000
                ){
                    user{
                        username
                        id
                    }
                }
            }
        '''
        schema.execute(cls.quser2)

        cls.qproperty = '''
            mutation test{
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
                        id
                    }
                }   
            }
        '''
        prop = schema.execute(cls.qproperty)
        cls.property_id = prop.data.get("createProperty").get("property").get("id")
        cls.qproperty2 = '''
            mutation test{
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 34
                    description: "No fumar"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "PisitoDeChill"
                    maxCapacity: 7
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
                        id
                    }
                }   
            }
        '''
        prop2 = schema.execute(cls.qproperty2)
        cls.property2_id = prop2.data.get("createProperty").get("property").get("id")

        cls.qpetition = '''
            mutation test($id: Int!){
                createPetition(propertyId:$id, requesterUsername:"Hola", message:"Mi habitación", userToken:""){
                    petition{
                        id
                    }
                }
            }
        '''
        exe = schema.execute(cls.qpetition, variables={'id': cls.property2_id})
        cls.petition_id = exe.data.get("createPetition").get("petition").get("id")

        cls.qproperty3 = '''
            mutation test{
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 50
                    description: "No mascotas"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "PisitoDeChillstep"
                    maxCapacity: 7
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
                        id
                    }
                }   
            }
        '''
        prop3 = schema.execute(cls.qproperty3)
        cls.property3_id = prop3.data.get("createProperty").get("property").get("id")

        cls.qpetition2 = '''
            mutation test($id: Int!){
                createPetition(propertyId:$id, requesterUsername:"Hola", message:"Habitación lunar", userToken:""){
                    petition{
                        id
                    }
                }
            }
        '''
        exe2 = schema.execute(cls.qpetition2, variables={'id': cls.property3_id})
        cls.petition2_id = exe2.data.get("createPetition").get("petition").get("id")

    def test_create_property_mutation(self):
        token = self.query('''
            mutation test {
                tokenAuth(
                    username: "usuario"
                    password: "contraseña"
                ){
                    token
                }
            }
        '''
        )
        authToken = json.loads(token.content)['data']['tokenAuth']['token']
        response = self.query('''
            mutation test($token: String!){
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevillaaa"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: $token
                ){
                    property{
                        owner{
                            username
                        }
                        title
                    }
                }   
            }
        ''',
        variables={'token':authToken}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_create_property_mutation_negative_title(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "UWU"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El título debe tener entre 4 y 50 caracteres")
    
    def test_create_property_mutation_negative_description(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "albion online es un mmorpg no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado, explora un amplio mundo abierto con cinco biomas unicos, todo cuanto hagas tendra su repercusíon en el mundo, con su economia orientada al jugador de albion los jugadores crean practicamente todo el equipo a partir de los recursos que consiguen, el equipo que llevas define quien eres, cambia de arma y armadura para pasar de caballero a mago o juego como una mezcla de ambas clases, aventurate en el mundo abierto y haz frente a los habitantes y las criaturas de albion, inicia expediciones o adentrate en mazmorras en las que encontraras enemigos aun mas dificiles, enfrentate a otros jugadores en encuentros en el mundo abierto, lucha por los territorios o por ciudades enteras en batallas tacticas, relajate en tu isla privada donde podras construir un hogar, cultivar cosechas, criar animales, unete a un gremio, todo es mejor cuando se trabaja en grupo [musica] adentrate ya en el mundo de albion y escribe tu propia historia."
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pesito"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "La descripción no puede tener más de 1000 caracteres")
    
    def test_create_property_mutation_negative_bedrooms(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: -1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevillaaa"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El número de dormitorios debe estar entre 1 y 50")
    
    def test_create_property_mutation_negative_bathrooms(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: -3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El número de cuartos de baño debe estar entre 1 y 50")
    
    def test_create_property_mutation_negative_price(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: -245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El precio introducido no es válido. Debe estar entre 1 y 500k")
    
    def test_create_property_mutation_negative_municipality(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "S"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "No existe el municipio indicado")

    def test_create_property_mutation_negative_province(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "S"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "No existe la provincia indicada")
    
    def test_create_property_mutation_negative_dimensions(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: -23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El valor de dimensiones introducido no es correcto. Debe estar entre 1 y 50k")
    
    def test_create_property_mutation_negative_capacity(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "usuario"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: -5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "La capacidad máxima no es válida")
    
    def test_create_property_mutation_negative_user(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevilla"
                    ownerUsername: "Hola"
                    price: 245
                    municipality: "Sevilla"
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
                    tags: []
                    userToken: ""
                ){
                    property{
                        owner{
                            username
                        }
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El usuario debe ser propietario")

    def test_add_tag_to_property_mutation(self):
        response = self.query('''
            mutation test($id: Int!){
                addTagToProperty(id: $id, tag: "P", userToken:""){
    					property{
                            title
                            id
                            tags{
                                id
                                name
                            }
                    }
                }  
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_update_property_mutation(self):
        response = self.query('''
            mutation test($id: Int!){
                updateProperty(propertyId:$id, title:"Nombre", tags:[], userToken:""){
                    property{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_update_property_mutation_negative_title(self):
        response = self.query('''
            mutation test($id: Int!){
                updateProperty(propertyId:$id, title:"123", tags: [], userToken:""){
                    property{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El título debe tener entre 4 y 50 caracteres")
    
    def test_update_property_mutation_negative_description (self):
        response = self.query('''
            mutation test($id: Int!){
                updateProperty(propertyId:$id, description: "albion online es un mmorpg no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado, explora un amplio mundo abierto con cinco biomas unicos, todo cuanto hagas tendra su repercusíon en el mundo, con su economia orientada al jugador de albion los jugadores crean practicamente todo el equipo a partir de los recursos que consiguen, el equipo que llevas define quien eres, cambia de arma y armadura para pasar de caballero a mago o juego como una mezcla de ambas clases, aventurate en el mundo abierto y haz frente a los habitantes y las criaturas de albion, inicia expediciones o adentrate en mazmorras en las que encontraras enemigos aun mas dificiles, enfrentate a otros jugadores en encuentros en el mundo abierto, lucha por los territorios o por ciudades enteras en batallas tacticas, relajate en tu isla privada donde podras construir un hogar, cultivar cosechas, criar animales, unete a un gremio, todo es mejor cuando se trabaja en grupo [musica] adentrate ya en el mundo de albion y escribe tu propia historia.", tags: [], userToken:""){
                    property{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "La descripción no puede tener más de 1000 caracteres")
    
    def test_make_property_outstanding_mutation(self):
        response = self.query('''
            mutation test($id:Int!){
                makePropertyOutstanding(propertyId:$id, userToken:""){
                        property{
                            id
                            title
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)

    def test_make_property_outstanding_mutation_negative_property(self):
        response = self.query('''
            mutation test{
                makePropertyOutstanding(propertyId:340, userToken:""){
                        property{
                            id
                            title
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El inmueble seleccionado no existe")
    
    def test_make_property_outstanding_mutation_negative_outstanding(self):
        response = self.query('''
            mutation test($id:Int!){
                makePropertyOutstanding(propertyId:$id, userToken:""){
                        property{
                            id
                            title
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        json.loads(response.content)

        response = self.query('''
            mutation test($id:Int!){
                makePropertyOutstanding(propertyId:$id, userToken:""){
                        property{
                            id
                            title
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El inmueble ya es destacado")

    def test_delete_property_mutation(self):
        response = self.query('''
            mutation test($id:Int!){
                deleteProperty(propertyId: $id, userToken:""){
                            property{
                                    isInOffer
                                }
                            }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_create_petition_mutation(self):
        response = self.query('''
            mutation test($id: Int!){
                createPetition(propertyId:$id, requesterUsername:"Hola", message:"Un buen piso", userToken:""){
                    petition{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_create_petition_mutation_negative_property(self):
        response = self.query('''
            mutation test{
                createPetition(propertyId:250, requesterUsername:"Hola", message:"Un buen piso", userToken:""){
                    petition{
                        id
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
        self.assertEqual(content['errors'][0]['message'], "No se ha podido completar la solicitud debido a que el inmueble no existe")

    def test_create_petition_mutation_negative(self):
        response = self.query('''
            mutation test($id: Int!){
                createPetition(propertyId:$id, requesterUsername:"Hola", message:"Un buen piso", userToken:""){
                    petition{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        json.loads(response.content)

        response = self.query('''
            mutation test($id: Int!){
                createPetition(propertyId:$id, requesterUsername:"Hola", message:"Un buen piso", userToken:""){
                    petition{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Ya has realizado una solicitud a este inmueble.")

    def test_update_petition_status_mutation(self):
        response = self.query('''
            mutation test($id: Int!){
                updateStatusPetition(petitionId:$id, statusPetition:"P", userToken:""){
                    petition{
                        id
                    }
                }
            }
        ''',
        variables={'id': int(self.petition_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_delete_petition_mutation(self):
        response = self.query('''
            mutation test($id:Int!){
                deletePetition(petitionId: $id, userToken:""){
                    petition{
                        creationAt
                    }
                }
            }
        ''',
        variables={'id': int(self.petition2_id)}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_add_users_to_favourite_property_mutation(self):
        token = self.query('''
            mutation test {
                tokenAuth(
                    username: "Hola"
                    password: "1234"
                ){
                    token
                }
            }
        '''
        )
        authToken = json.loads(token.content)['data']['tokenAuth']['token']
        response = self.query('''
            mutation test($id:Int!, $token: String!){
                addUsersToFavouriteProperty(propertyId:$id, username:"Hola", userToken:$token){
                        user{
                            username
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id), 'token':authToken}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_add_users_to_favourite_property_mutation_negative_user(self):
        response = self.query('''
            mutation test($id:Int!){
                addUsersToFavouriteProperty(propertyId:$id, username:"toro", userToken:""){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El usuario con nombre de usuario toro no existe")
    
    def test_add_users_to_favourite_property_mutation_negative_property(self):
        response = self.query('''
            mutation test{
                addUsersToFavouriteProperty(propertyId:69, username:"miguel", userToken:""){
                    property{
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El inmueble seleccionado no existe")
    
    def test_add_users_to_favourite_property_mutation_negative_user_equals(self):
        response = self.query('''
            mutation test($id:Int!){
                addUsersToFavouriteProperty(propertyId:$id, username:"usuario", userToken:""){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "No puedes marcar tu propio inmueble como favorito")
    
    def test_add_users_to_favourite_property_mutation_negative_favourite(self):
        response1 = self.query('''
            mutation test($id:Int!){
                addUsersToFavouriteProperty(propertyId:$id, username:"Hola", userToken:""){
                        user{
                            username
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )
        
        json.loads(response1.content)

        response = self.query('''
            mutation test($id:Int!){
                addUsersToFavouriteProperty(propertyId:$id, username:"Hola", userToken:""){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Ya has marcado este piso como favorito")
    
    def test_delete_users_to_favourite_property_mutation(self):
        token = self.query('''
            mutation test {
                tokenAuth(
                    username: "miguel"
                    password: "contraseña"
                ){
                    token
                }
            }
        '''
        )
        authToken = json.loads(token.content)['data']['tokenAuth']['token']
        response1 = self.query('''
            mutation test($id:Int!, $token: String!){
                addUsersToFavouriteProperty(propertyId:$id, username:"miguel", userToken:$token){
                        user{
                            username
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id), 'token':authToken}
        )
        json.loads(response1.content)
        response = self.query('''
            mutation test($id:Int!, $token: String!){
                deleteUsersToFavouriteProperty(propertyId:$id, username:"miguel", userToken:$token){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id), 'token':authToken}
        )

        try:
            json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseNoErrors(response)
    
    def test_delete_users_to_favourite_property_mutation_negative_user(self):
        response = self.query('''
            mutation test($id:Int!){
                deleteUsersToFavouriteProperty(propertyId:$id, username:"toro", userToken:""){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "El usuario con nombre de usuario toro no existe")
    
    def test_delete_users_to_favourite_property_mutation_negative_property(self):
        response1 = self.query('''
            mutation test($id:Int!){
                addUsersToFavouriteProperty(propertyId:$id, username:"miguel"){
                        user{
                            username
                    }
                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )
        json.loads(response1.content)
        response = self.query('''
            mutation test{
                deleteUsersToFavouriteProperty(propertyId:69, username:"miguel", userToken:""){
                    property{
                        title
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
        self.assertEqual(content['errors'][0]['message'], "El inmueble seleccionado no existe")

    def test_delete_users_to_favourite_property_mutation_negative(self):
        response = self.query('''
            mutation test($id:Int!){
                deleteUsersToFavouriteProperty(propertyId:$id, username:"miguel", userToken:""){
                    property{
                        title
                    }

                }
            }
        ''',
        variables={'id': int(self.property_id)}
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
        self.assertEqual(content['errors'][0]['message'], "Ya has eliminado este usuario")