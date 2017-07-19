<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            
            // Fields
            $table->increments('id');  
            $table->enum('contact_mean', [ 'email', 'web', 'telefono', 'other']);
            $table->integer('sale_status_id')->unsigned();
            $table->integer('enterprise_id')->unsigned();
            $table->integer('contact_id')->unsigned();
            $table->integer('currency_id')->unsigned();
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Constraints
            $table->foreign('enterprise_id')
                ->references('id')->on('enterprises')
                ->onDelete('restrict');   
            $table->foreign('contact_id')
                ->references('id')->on('contacts')
                ->onDelete('restrict'); 
            $table->foreign('currency_id')
                ->references('id')->on('currencies')
                ->onDelete('restrict');   
            $table->foreign('sale_status_id')
                ->references('id')->on('sale_status')
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
        Schema::dropIfExists('sales');
    }
}
