import * as kubernetes from "@pulumi/kubernetes";
import { deployIngressController } from "./ingressController";

const nginx = (kubernetesProvider) => {
  const nginxDeployment = new kubernetes.apps.v1.Deployment(
    "nginx",
    {
      metadata: {
        name: "nginx",
        labels: {
          app: "nginx",
        },
      },
      spec: {
        selector: {
          matchLabels: {
            app: "nginx",
          },
        },
        template: {
          metadata: {
            labels: {
              app: "nginx",
            },
          },
          spec: {
            containers: [
              {
                name: "nginx",
                image: "nginx",
              },
            ],
          },
        },
      },
    },
    {
      provider: kubernetesProvider,
    }
  );

  const nginxService = new kubernetes.core.v1.Service(
    "nginx",
    {
      spec: {
        selector: {
          app: "nginx",
        },
        ports: [
          {
            port: 80,
          },
        ],
      },
    },
    {
      provider: kubernetesProvider,
    }
  );

  deployIngressController(kubernetesProvider);

  const nginxMapping = new kubernetes.apiextensions.CustomResource(
    "nginxMapping",
    {
      apiVersion: "getambassador.io/v3alpha1",
      kind: "Mapping",
      metadata: {
        name: "nginx",
      },
      spec: {
        hostname: "*",
        prefix: "/",
        service: nginxService.metadata.name,
      },
    }
  );

  return nginxDeployment;
};

export default nginx;
