import * as kubernetes from "@pulumi/kubernetes";

const ingress = (kubernetesProvider) => {
  const nginxIngress = new kubernetes.networking.v1.Ingress(
    "nginx",
    {
      metadata: {
        annotations: {
          "pulumi.com/skipAwait": "true",
        },
      },
      spec: {
        ingressClassName: "nginx",
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: "nginx-044168c8", // @TODO: get this from the service
                      port: {
                        number: 80,
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
      provider: kubernetesProvider,
    }
  );

  return nginxIngress;
};

export default ingress;
