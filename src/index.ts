import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const eddiehubio = new digitalocean.Domain(
  "eddiehubio",
  { name: "eddiehub.io" },
  {
    retainOnDelete: true,
  }
);

const clusterName = pulumi.getStack();

const kubernetesCluster = new digitalocean.KubernetesCluster(clusterName, {
  region: digitalocean.Region.LON1,
  nodePool: {
    name: "pool-one",
    size: digitalocean.DropletSlug.DropletS2VCPU2GB,
    nodeCount: 1,
    minNodes: 1,
    maxNodes: 2,
  },
  version: digitalocean.getKubernetesVersions().then((p) => p.latestVersion),
});

export const kubeconfig = kubernetesCluster.status.apply((status) => {
  if (status === "running") {
    const clusterDataSource = kubernetesCluster.name.apply((name) =>
      digitalocean.getKubernetesCluster({ name })
    );
    return clusterDataSource.kubeConfigs[0].rawConfig;
  } else {
    return kubernetesCluster.kubeConfigs[0].rawConfig;
  }
});

const kubernetesProvider = new kubernetes.Provider("digitalocean", {
  kubeconfig,
});

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

import { deployIngressController } from "./ingressController";

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
