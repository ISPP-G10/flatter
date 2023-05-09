resource "google_compute_instance" "test" {
  name         = var.instance_name
  machine_type = var.instance_machine_type
  zone         = var.zone

  tags = ["flatter-instance"]

  boot_disk {
    initialize_params {
      image = var.instance_image
    }
  }

  network_interface {
    network = google_compute_network.flatter_network.name

    access_config {
      nat_ip = google_compute_address.static.address
    }
  }

  metadata = {
    ssh-keys = "${var.user}:${file(var.publickeypath)}"
  }

  provisioner "file" {

    # source file name on the local machine where you execute terraform plan and apply
    source = "startup.sh"
    # destination is the file location on the newly created instance
    destination = "/tmp/startup.sh"
    connection {
      host = google_compute_address.static.address
      type = "ssh"
      # username of the instance would vary for each account refer the OS Login in GCP documentation
      user    = var.user
      timeout = "500s"
      # private_key being used to connect to the VM. ( the public key was copied earlier using metadata )
      private_key = file(var.privatekeypath)
    }
  }
  # to connect to the instance after the creation and execute few commands for provisioning
  # here you can execute a custom Shell script or Ansible playbook
  provisioner "remote-exec" {
    connection {
      host = google_compute_address.static.address
      type = "ssh"
      # username of the instance would vary for each account refer the OS Login in GCP documentation
      user    = var.user
      timeout = "500s"
      # private_key being used to connect to the VM. ( the public key was copied earlier using metadata )
      private_key = file(var.privatekeypath)
    }
    # Commands to be executed as the instance gets ready.
    # set execution permission and start the script
    inline = [
      "chmod a+x /tmp/startup.sh",
      "sed -i -e 's/\r$//' /tmp/startup.sh",
      "sudo /tmp/startup.sh"
    ]
  }

  depends_on = [google_compute_firewall.flatter_firewall]
}

resource "google_compute_address" "static" {
  name       = "${var.instance_name}-public-address"
  depends_on = [google_compute_firewall.flatter_firewall]
}