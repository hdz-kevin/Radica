<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            // Registration omits confirmation because the form has a single password field.
            'password' => $this->passwordRules(confirmed: false),
        ])->validate();

        $user = new User;
        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'terms_accepted_at' => now(),
        ]);
        $user->save();

        return $user;
    }
}
