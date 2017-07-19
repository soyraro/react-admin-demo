<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'namespace' => 'Api'  
    ], function () {

        /**
         * Greetings
         */
        Route::get('/', ['as' => 'greetings', function() {
        
            return [
                'greetings' => 'Welcome to Control FWS API',
                'authenticate' => env('APP_URL').'/oauth/token',
                'current_api_version' => config('app.current_api_version', 1),
            ];
        }]);
        
        /*****************
         * Authentication
         *****************/
        Route::post('/authenticate', 'LoginController@authenticate');
        Route::post('/refresh-token', 'LoginController@refreshToken');
     
        /**
         * API v1
         */
        Route::group(['prefix' => 'v1', 'namespace' => 'v1'], function($app) {

            // No action
            Route::get('/', [function() {
                return [
                    'api_version' => 1
                ];
            }]);
            
            /**************
             * Public API
             **************/
            
            /**
             * User getters
             */
            Route::get('/users', 'UserController@index');
            Route::get('/users/{id}', 'UserController@show')->where('id', '[0-9]+');
            
            /**
             * Enterprise getters
             */
            Route::get('/enterprises', 'EnterpriseController@index');
            Route::get('/enterprises/{id}', 'EnterpriseController@show')->where('id', '[0-9]+');
            Route::get('/enterprises/{enterprise_id}/sectors', 'EnterpriseSectorController@index')->where('enterprise_id', '[0-9]+');
            Route::get('/enterprises/{enterprise_id}/sectors/{sector_id}', 'EnterpriseSectorController@show')->where(['enterprise_id'=>'[0-9]+', 'sector_id'=>'[0-9]+']);
            
            /**
             * Contact getters
             */
            Route::get('/contacts/states', 'ContactController@states');
            Route::get('/enterprises/contacts', 'ContactEnterpriseController@all');
            Route::get('/enterprises/{enterprise_id}/contacts', 'ContactEnterpriseController@index')->where('enterprise_id', '[0-9]+');
            Route::get('/enterprises/{enterprise_id}/contacts/{contact_id}', 'ContactEnterpriseController@show')->where(['enterprise_id'=>'[0-9]+', 'contact_id'=>'[0-9]+']);
                        
            /**
             * Interaction getters
             */
            Route::get('/enterprises/{enterprise_id}/interactions', 'EnterpriseInteractionController@index')->where('enterprise_id', '[0-9]+');
            Route::get('/enterprises/{enterprise_id}/interactions/{interaction_id}', 'EnterpriseInteractionController@show')->where(['enterprise_id'=>'[0-9]+', 'interaction_id'=>'[0-9]+']);
            // contact_id provided
            Route::get('/contacts/{contact_id}/interactions', 'ContactInteractionController@index')->where('contact_id', '[0-9]+');
            
            /**
             *  Providers getters
             */   
            Route::get('/providers', 'ProviderController@index');
            Route::get('/providers/{id}', 'ProviderController@show')->where('id', '[0-9]+');
            
            /**
             *  Product getters
             */   
            Route::get('/products', 'ProductController@index');
            Route::get('/products/{id}', 'ProductController@show')->where('id', '[0-9]+');
            
            /**
             * Family getters
             */
            Route::get('/families', 'FamilyController@index');
            Route::get('/families/{family_id}/groups', 'GroupController@index')->where('family_id', '[0-9]+');
            
            /**
             *  Countries getters
             */   
            Route::get('/countries', 'CountryController@index');
            Route::get('/countries/{country_id}/provinces', 'CountryController@provinces')->where('country_id', '[0-9]+');
            
            
            /***************
             * Private API
             ***************/
            Route::group(['middleware' => 'auth:api'], function(){

                /**
                 *  User CRUD routes
                 */   
                Route::get('/users/me', 'UserController@me');
                Route::post('/users', 'UserController@store'); // create user 
                Route::put('/users/{id}', 'UserController@update')->where('id', '[0-9]+');
                Route::delete('/users/{id}', 'UserController@destroy')->where('id', '[0-9]+');
                
                // Store user image
                Route::post('/users/{user_id}/image', 'UserImageController@store')->where('id', '[0-9]+'); 

                /**
                 *  Enterprise CRUD routes
                 */   
                Route::post('/enterprises', 'EnterpriseController@store');
                Route::put('/enterprises/{id}', 'EnterpriseController@update')->where('id', '[0-9]+');
                Route::delete('/enterprises/{id}', 'EnterpriseController@destroy')->where('id', '[0-9]+');

                /**
                 * Enterprise Sectors
                 */
                Route::post('/enterprises/{enterprise_id}/sectors', 'EnterpriseSectorController@store')->where('enterprise_id', '[0-9]+');
                Route::put('/enterprises/{enterprise_id}/sectors/{sector_id}', 'EnterpriseSectorController@update')->where(['enterprise_id'=>'[0-9]+', 'sector_id'=>'[0-9]+']);
                Route::delete('/enterprises/{enterprise_id}/sectors/{sector_id}', 'EnterpriseSectorController@destroy')->where(['enterprise_id'=>'[0-9]+', 'sector_id'=>'[0-9]+']);

                /**
                 * Enterprise Contacts
                 */
                Route::post('/enterprises/{enterprise_id}/contacts', 'ContactEnterpriseController@store')->where('enterprise_id', '[0-9]+');
                Route::put('/enterprises/{enterprise_id}/contacts/{contact_id}', 'ContactEnterpriseController@update')->where(['enterprise_id'=>'[0-9]+', 'contact_id'=>'[0-9]+']);
                Route::put('/enterprises/{enterprise_id}/contacts/{contact_id}/state', 'ContactEnterpriseController@updateState')->where(['enterprise_id'=>'[0-9]+', 'contact_id'=>'[0-9]+']);
                Route::delete('/contacts/{id}', 'ContactController@destroy')->where(['contact_id'=>'[0-9]+']);

                /**
                 * Contact Interactions
                 */
                Route::post('/contacts/{contact_id}/interactions', 'ContactInteractionController@store')->where('contact_id', '[0-9]+');
                Route::put('/contacts/{contact_id}/interactions/{interaction_id}', 'ContactInteractionController@update')->where(['contact_id'=>'[0-9]+', 'interaction_id'=>'[0-9]+']);
                Route::delete('/contacts/{contact_id}/interactions/{interaction_id}', 'ContactInteractionController@destroy')->where(['contact_id'=>'[0-9]+', 'interaction_id'=>'[0-9]+']);

            });

            /**
            *  Catch unknown endpoints
            */
            Route::any('{any:.*}', function ($any = null) {
                throw new Symfony\Component\HttpKernel\Exception\HttpException(400, "Endpoint not found: {$any}");
            });   
        });  
       
        /**
        * Fallback to current API version
        */
        Route::get('{any:.*}', function ($any = null) {
            $current_api_version = config('app.current_api_version', 1);
            return response('', 302)
                    ->header('Location', "/api/v{$current_api_version}/{$any}");
        });
});
