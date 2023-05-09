# resource "google_compute_network" "flatter_network" {
#   name                    = var.network_name
#   auto_create_subnetworks = true
#   mtu                     = 1460
# }

# resource "google_compute_firewall" "flatter_firewall" {
#   name    = var.firewall_name
#   network = google_compute_network.flatter_network.name

#   allow {
#     protocol = "icmp"
#   }

#   allow {
#     protocol = "tcp"
#     ports    = ["22", "80", "443"]
#   }

#   source_ranges = ["0.0.0.0/0"]
#   source_tags   = ["flatter-instance"]
# }