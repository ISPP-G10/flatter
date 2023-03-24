import json
from django.db import IntegrityError
from django.test import TestCase
from authentication.models import FlatterUser, Tag
from .models import Property
from backend.schema import schema
from graphene_django.utils.testing import GraphQLTestCase


# Create your tests here.
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

        self.property = Property.objects.create(
            title="title",
            description="description",
            bedrooms_number=3,
            bathrooms_number=2,
            price=100,
            location="location",
            province="province",
            dimensions=200,
            owner=self.user,
            max_capacity=5,
        )
    
    def test_createPropertyPositive(self):
        
        assert Property.objects.count() == 1

    def test_createPropertyNegative(self):
        
        try:
            self.property = Property.objects.create(
                title="title",
                description="description",
                bedrooms_number=3,
                bathrooms_number=2,
                price=100,
                location="location",
                province="province",
                dimensions=200,
                owner=self.user,
                max_capacity=-5,
            ) 
            self.fail("Se esperaba un error por creación de inmueble")
        except IntegrityError:
            pass
    
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
    
    #Tests de query de GraphQL 
    def test_resolve_get_properties(self):
        query = '''
            query test{
                getProperties {
                    title
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors

    def test_resolve_get_property_by_title(self):
        query = '''
            query test{
                getPropertyByTitle(title: "title") {
                    title
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    # def test_resolve_get_property_by_id(self):
    #     query = '''
    #         query test{
    #             getPropertyById(id: 16) {
    #                 title
    #                 id
    #             }
    #         }
    #     '''
    #     result = schema.execute(query)
    #     assert not result.errors
    
    def test_resolve_get_all_tags(self):
        query = '''
            query test{
                getAllTags {
                    name
                    id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
    
    def test_resolve_get_filtered_properties_by_price_and_city_and_tags(self):
        query = '''
            query test{
                getFilteredPropertiesByPriceAndCityAndTags(minPrice: 90, maxPrice: 200) {
                   	title
                  	id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors

    def test_resolve_get_properties_by_owner(self):
        query = '''
            query test{
                getPropertiesByOwner(username: "Hola") {
                   title
                   id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
        
    
    def test_resolve_get_outstanding_properties(self):
        self.property.is_outstanding = True
        query = '''
            query test{
                getOutstandingProperties {
                   title
                   id
                }
            }
        '''
        result = schema.execute(query)
        assert not result.errors
        
#Tests de mutation con graphQL
class DefaultTests(GraphQLTestCase):

    def setUp(self):
        self.GRAPHQL_URL = '/api/graphql/'

class TestsMutations(DefaultTests):

    def setUp(self):
        super().setUp()
        self.quser = '''
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
        schema.execute(self.quser)
        self.qproperty = '''
            mutation test{
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevillaaa"
                    ownerUsername: "usuario"
                    price: 245
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
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
        schema.execute(self.qproperty)

    def test_create_property_mutation(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 2
                    bedroomsNumber: 1
                    dimensions: 23
                    description: "Perro malo"
                    location: "Sevillaaa"
                    ownerUsername: "usuario"
                    price: 245
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
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

        self.assertResponseNoErrors(response)
    
    def test_create_property_mutation_negative_dimensions(self):
        response = self.query('''
            mutation test{
                createProperty(
                    bathroomsNumber: 3
                    bedroomsNumber: 1
                    dimensions: -23
                    description: "Perro malo"
                    location: "Sevillaaa"
                    ownerUsername: "usuario"
                    price: 245
                    province: "Sevilla"
                    title: "Pisito2"
                    maxCapacity: 5
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
        self.assertEqual(content['errors'][0]['message'], "Las dimensiones deben poseer un valor positivo")
    
    def test_add_tag_to_property_mutation(self):
        response = self.query('''
            mutation test{
                addTagToProperty(id: 18, tag: "P"){
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
        '''
        )

        try:
            content = json.loads(response.content)
        except json.JSONDecodeError as e:
            print(response.content)
            raise e

        self.assertResponseHasErrors(response)
    
    def test_update_property_mutation(self):
        response = self.query('''
            mutation test{
                updateProperty(propertyId:20){
                    property{
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

        self.assertResponseNoErrors(response)
    
    def test_make_property_outstanding_mutation(self):
        response = self.query('''
            mutation test{
                makePropertyOutstanding(propertyId:19){
                        property{
                            id
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

        self.assertResponseNoErrors(response)
    
    def test_delete_property_mutation(self):
        response = self.query('''
            mutation test{
                deleteProperty(propertyId:18){
                            property{
                                    isInOffer
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
    
    
    
        