<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputOption;

#[AsCommand(name: 'make:repository')]
class RepositoryMakeCommand extends GeneratorCommand
{
    protected $name = 'make:repository';

    protected $description = 'Create a new repository class';

    protected function getStub(): string
    {
        return $this->isModel()
            ? $this->resolveStubPath('/stubs/repository.model.stub')
            : $this->resolveStubPath('/stubs/repository.stub');
    }

    protected function resolveStubPath(string $stub): string
    {
        return file_exists($customPath = $this->laravel->basePath(trim($stub, '/')))
            ? $customPath
            : __DIR__.$stub;
    }

    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace.'\Repositories';
    }

    protected function getNameInput(): string
    {
        $name = trim($this->argument('name'));

        return Str::endsWith($name, 'Repository') ? $name : $name.'Repository';
    }

    protected function getOptions()
    {
        return [
            ['model', 'm', InputOption::VALUE_OPTIONAL, 'Create model repository class'],
            ['force', 'f', InputOption::VALUE_NONE, 'Create the class even if the repository already exists'],
        ];
    }

    protected function isModel()
    {
        return $this->option('model')
            && class_exists($this->qualifyModel($this->option('model')));
    }

    protected function buildClass($name)
    {
        if ($this->isModel()) {
            $class = '\\'.$this->qualifyModel($this->option('model'));

            $replace = [
                'DummyModel' => $class,
                '{{ model }}' => $class,
                '{{model}}' => $class,
                'DummyModelVariable' => lcfirst(class_basename($class)),
                '{{ modelVariable }}' => lcfirst(class_basename($class)),
                '{{modelVariable}}' => lcfirst(class_basename($class)),
            ];

            return str_replace(
                array_keys($replace), array_values($replace), parent::buildClass($name)
            );

        }

        return parent::buildClass($name);
    }
}
