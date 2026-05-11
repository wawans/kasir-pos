<?php

namespace App\Repositories;

use App\Data\UserData;
use App\Models\User;
use App\Repositories\Concerns\WithTable;
use Illuminate\Support\Facades\Hash;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\UserRepository
 *
 * @method \Illuminate\Database\Eloquent\Builder|User query()
 * @method User update(array $attributes, User $user)
 */
class UserRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected User $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters('name', 'email')
            ->allowedSorts('id', 'name', 'email', 'created_at', 'updated_at')
            ->defaultSort('-updated_at');
        // ->with(['roles'])
    }

    public function toCollection($data)
    {
        return UserData::collect($data);
    }

    public function toData($model)
    {
        return UserData::from($model);
    }

    public function register(array $attributes)
    {
        // $attributes['roles'] = [Role::findByName('USER', 'web')->getKey()];

        return $this->store($attributes);
    }

    /**
     * Create a new instance of the given model.
     *
     * @return User
     */
    public function store(array $attributes)
    {
        $attributes = collect($attributes);
        $attributes->put('setting', [
            'onboarding' => 1,
            'theme' => 'light',
        ]);

        $model = $this->create(
            $attributes->only($this->model->getFillable())
                ->merge(['password' => Hash::make($attributes->get('password'))])
                ->toArray()
        );

        $this->syncAccount($attributes, $model);
        $this->syncRole($attributes, $model);

        return $model;
    }

    /**
     * Update the model in the database.
     *
     * @param  User  $user
     * @return User
     */
    public function edit(array $attributes, $user)
    {
        $attributes = collect($attributes);

        $user = $this->update(
            $attributes->only($this->model->getFillable())
                ->except('password')
                ->toArray(),
            $user
        );

        if (! blank($attributes->get('password'))) {
            $user->fill([
                'password' => Hash::make($attributes->get('password')),
            ]);
            $user->save();
        }

        $this->syncAccount($attributes, $user);
        $this->syncRole($attributes, $user);

        return $user;
    }

    public function syncAccount($attributes, User $model)
    {
        if ($attributes->has('status_email_verified')) {
            $value = $attributes->get('status_email_verified');

            if ($value == 1 || $value === true) {
                $model->markEmailAsVerified();
            } else {
                $model->forceFill(['email_verified_at' => null]);
            }
            $model->saveQuietly();
        }

        //
    }

    public function syncRole($attributes, User $model)
    {
        if ($attributes->has('roles') && is_array($attributes->get('roles'))) {
            $roles = $attributes->get('roles');

            $model->syncRoles(array_map(fn ($v): int => $v, $roles));
            $model->saveQuietly();
        }
    }

    /**
     * Delete the model from the database.
     *
     * @param  User  $user
     * @return bool|null|void
     */
    public function destroy($user)
    {
        return $this->delete($user);
    }
}
