<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('reference')->nullable();
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete()->cascadeOnUpdate();            
            $table->double('cost')->default(0);            
            $table->double('tax')->default(0);
            $table->double('discount')->default(0);
            $table->double('shipping')->default(0);
            $table->double('total')->default(0);
            $table->double('received_amount')->default(0);
            $table->date('received_date')->nullable();
            $table->foreignId('received_method_id')->constrained('payment_methods')->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedTinyInteger('received_status')->default(1);
            $table->text('note')->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_returns');
    }
};
