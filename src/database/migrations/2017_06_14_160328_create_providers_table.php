<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('providers', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');
            $table->string('legal_name', 70)->unique();
            $table->string('cuit', 13)->unique();
            $table->integer('country_id')->unsigned();
            $table->integer('province_id')->unsigned();
            $table->string('town', 40);
            $table->string('address', 120);
            $table->string('zipcode', 12)->nullable();
            $table->text('phone');
            $table->text('email');
            $table->text('web')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('country_id')
                ->references('id')->on('countries')
                ->onDelete('restrict');
            $table->foreign('province_id')
                ->references('id')->on('provinces')
                ->onDelete('restrict');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('providers');
    }
}
