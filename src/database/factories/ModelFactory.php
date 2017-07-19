<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'fullname' => $faker->name,
        'username' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'image'=> 'default_image.png',
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Enterprise::class, function (Faker\Generator $faker) {

    $province = App\Province::all()->random();
    
    return [
            'legal_name'=> $faker->company . ' ' . $faker->word,
            'cuit'=> $faker->numerify('30-########-#'),
            'country_id'=> $province->country_id,
            'province_id'=> $province->id,
            'town'=> $faker->city,
            'address'=> $faker->address,
            'zipcode'=> $faker->postcode,
            'phone'=> $faker->phoneNumber,      
            'observations'=> $faker->text,
            'client_type'=> rand(0, 1) ? 'cliente' : 'otros_clientes'
        ];
});

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Web::class, function (Faker\Generator $faker) {
    
    return [
        'type' => rand(0, 1) ? 'invoice' : 'bidding',
        'link'=> $faker->url,
        'user'=> $faker->userName,
        'password'=> $faker->password,
        'enterprise_id'=> App\Enterprise::all()->random()->id,
    ];
});

$factory->define(App\Sector::class, function (Faker\Generator $faker) {

    return [
        'enterprise_id'=> App\Enterprise::all()->random()->id,
        'name'=> $faker->words(3, true)
    ];
});

$factory->define(App\Contact::class, function (Faker\Generator $faker) {

    return [
            'fullname'=> $faker->firstName . ' ' . $faker->lastName,
            'position'=> $faker->jobTitle,
            'phones'=> $faker->phoneNumber,
            'cellphone'=> $faker->phoneNumber
        ];     
});

$factory->define(App\Interaction::class, function (Faker\Generator $faker, $contact_id = null) {

    return [
            'contact_id' => $contact_id || App\Contact::all()->random()->id,
            'description'=> $faker->sentence(12),
            'created_at'=> Carbon\Carbon::now()
        ];
});

$factory->define(App\Provider::class, function (Faker\Generator $faker) {

    return [
            'legal_name'=> $faker->company,
            'cuit'=> $faker->numerify('30-########-#'),
            'country_id'=> App\Country::all()->random()->id,
            'province_id'=> App\Province::all()->random()->id,
            'town'=> $faker->city,
            'address'=> $faker->address,
            'zipcode'=> $faker->postcode,
            'phone'=> $faker->phoneNumber,      
            'email'=> $faker->email,      
            'web'=> $faker->url,      
            'observations'=> $faker->text,
        ];
});

$factory->define(App\Email::class, function (Faker\Generator $faker, $contact_id = null) {

    return [
            'contact_id' => $contact_id || App\Contact::all()->random()->id,
            'email'=> $faker->email
        ];
});

$factory->define(App\Country::class, function (Faker\Generator $faker) {

    return [
            'name'=> $faker->country,
            'code'=> $faker->countryCode,
        ];
});

$factory->define(App\Province::class, function (Faker\Generator $faker) {

    return [
            'name'=> $faker->state,
            'country_id'=> App\Country::all()->random()->id,
        ];
});

$factory->define(App\Currency::class, function (Faker\Generator $faker) {

    return [
            'name'=> rand(0, 1) ? '$AR' : 'U$D'
        ];
});

$factory->define(App\Family::class, function (Faker\Generator $faker) {

    return [
            'name'=> $faker->word,
        ];
});

$factory->define(App\Group::class, function (Faker\Generator $faker) {

    return [
            'name'=> $faker->word,
            'family_id'=> App\Family::all()->random()->id
        ];
});

$factory->define(App\Product::class, function (Faker\Generator $faker) {

    return [
            'type'=> $faker->randomElement(['producto', 'repuesto']),
            'code'=> $faker->uuid,
            'name'=> $faker->words(3, true),
            'provider_id'=> App\Provider::all()->random()->id,
            'family_id'=> App\Family::all()->random()->id,
            'group_id'=> App\Group::all()->random()->id,
            'price'=> $faker->randomFloat(2, 200, 9000),
            'currency_id'=> App\Currency::all()->random()->id
        ];
});
