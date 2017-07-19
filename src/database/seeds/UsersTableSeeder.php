<?php

use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('users')->delete();
        
        User::create(array(
            'fullname' => 'Alejo Constante',
            'username' => 'admin',
            'email' => 'alejo@constante.net',
            'password' => Hash::make('admin'),
            'image'=> 'default_image.png',
            'created_at'=> Carbon::now(),
            'updated_at'=> Carbon::now()
        ));
        
        factory(User::class, 12)->create(); // some more
    }
}
