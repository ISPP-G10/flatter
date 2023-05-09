# De configuración global

variable "user" {
  type        = string
  description = "The user to connect to the instance"
}

variable "project" {
  type        = string
  description = "The project to deploy to"
}

variable "project_id" {
  type        = string
  description = "The project ID to deploy to"
}

variable "region" {
  type        = string
  description = "The region to deploy to"
  default     = "europe-southwest1"
}

variable "zone" {
  type        = string
  description = "The zone to deploy to"
  default     = "europe-southwest1-a"
}

variable "json_credentials" {
  type        = string
  description = "The path to the JSON credentials file"
}

# De configuración de la red

variable "network_name" {
  type        = string
  description = "The name of the network"
  default     = "flatter-network"
}

variable "firewall_name" {
  type        = string
  description = "The name of the firewall"
  default     = "flatter-firewall"
}

# De configuración de la instancia

variable "instance_name" {
  type        = string
  description = "The name of the instance"
  default     = "flatter-instance"
}

variable "instance_machine_type" {
  type        = string
  description = "The machine type of the instance"
  default     = "e2-small"
}

variable "instance_image" {
  type        = string
  description = "The OS image used by the instance"
  default     = "ubuntu-os-cloud/ubuntu-1804-lts"
}

# Configuración SSH

variable "publickeypath" {
  type        = string
  description = "The path to the public key"
  default     = "./.ssh/flatterSsh.pub"
}

variable "privatekeypath" {
  type        = string
  description = "The path to the private key"
  default     = "./.ssh/flatterSsh"
}