using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [ (name = "client", disk = "client") ],
  sockets = [ ( name = "http", address = "*:8080", http = (), service = "client" ) ]
);
