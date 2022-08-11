import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const clusterName = pulumi.getStack();

export const createCluster = () =>
  new digitalocean.KubernetesCluster(
    clusterName,
    {
      region: digitalocean.Region.LON1,
      nodePool: {
        name: "pool-one",
        size: digitalocean.DropletSlug.DropletS2VCPU2GB,
        nodeCount: 1,
        minNodes: 1,
        maxNodes: 2,
      },
      version: "1.23.9-do.0",
    },
    {
      ignoreChanges: ["version"],
    }
  );

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

export const kubernetesProvider = new kubernetes.Provider("digitalocean", {
  kubeconfig,
});
