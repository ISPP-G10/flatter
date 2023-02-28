resource "google_container_cluster" "primary" {
    name     = "${var.cluster_name}"
    location = "${var.region}"

    enable_autopilot = true

    ip_allocation_policy {
    }
}
