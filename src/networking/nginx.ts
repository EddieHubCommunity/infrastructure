import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
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
        annotations: {
          "pulumi.com/skipAwait": "true",
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
      metadata: {
        annotations: {
          "pulumi.com/skipAwait": "true",
        },
      },
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

  return nginxDeployment;
};

export default nginx;
