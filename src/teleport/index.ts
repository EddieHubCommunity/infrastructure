import * as kubernetes from "@pulumi/kubernetes";

// helm install teleport/teleport-cluster \
//     --set acme=true \
//     --set acmeEmail=alice@example.com \
//     --set clusterName=teleport.example.com\
//     --create-namespace \
//     --namespace=teleport-cluster \
//     ./teleport-cluster/

export const deployTeleport = (name: string, provider: kubernetes.Provider) => {
  const chart = new kubernetes.helm.v3.Release(
    `teleport-${name}`,
    {
      chart: "teleport-cluster",
      repositoryOpts: {
        repo: "https://charts.releases.teleport.dev",
      },
      name: "teleport",
      values: {
        acme: true,
        acmeEmail: "eddie@jaoudestudios.com",
        // TODO: Pull this from the domain
        clusterName: "teleport.eddiehubcommunity.org",
        service: {
          type: "ClusterIP",
        },
      },
    },
    {
      provider,
    }
  );

  const ingress = new kubernetes.networking.v1.Ingress(
    "teleport",
    {
      metadata: {
        name: "teleport",
      },
      spec: {
        ingressClassName: "nginx",
        rules: [
          {
            host: "teleport.eddiehubcommunity.org",
            http: {
              paths: [
                {
                  pathType: "Prefix",
                  path: "/",
                  backend: {
                    service: {
                      name: "teleport", // TODO: get this dynamically
                      port: {
                        number: 443,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      dependsOn: chart,
      provider,
    }
  );

  return chart;
};
