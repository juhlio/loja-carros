<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Admin extends Model
{
    protected $table = "admins";

    protected $fillable = [
        "nome",
        "email",
        "password",
        "role",
        "ativo",
    ];

    protected $hidden = ["password"];

    protected $casts = [
        "ativo" => "boolean",
    ];

    public function setPasswordAttribute($value): void
    {
        if ($value) {
            $this->attributes["password"] = Hash::make($value);
        }
    }

    public function validatePassword($password): bool
    {
        return Hash::check($password, $this->password);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === "super_admin";
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ["super_admin", "admin"]);
    }

    public function isVendedor(): bool
    {
        return $this->role === "vendedor";
    }
}
