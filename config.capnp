using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "worker", worker = .worker),
    (name = "client", disk = "client"),
  ],
  sockets = [ ( name = "http", address = "*:8080", http = (), service = "worker") ]
);

const worker :Workerd.Worker = (
  compatibilityDate = "2025-06-16",

  modules = [
    (name = "worker", esModule = embed "dist/worker.js"),
  ],

  bindings = [
    (name = "files", service = "client"),
  ],
);
