package main

import "github.com/ilyakaznacheev/cleanenv"

type Config struct {
	Port       string `env:"PORT" env-default:"8080"`
	DistDir    string `env:"DIST_DIR" env-default:"dist"`
	ConfigsDir string `env:"CONFIGS_DIR" env-default:"public/configs"`
	LogLevel   string `env:"LOG_LEVEL" env-default:"info"`
	GinMode    string `env:"GIN_MODE" env-default:"release"`
}

func LoadConfig() (*Config, error) {
	var cfg Config
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
