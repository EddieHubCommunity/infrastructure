import * as pulumi from "@pulumi/pulumi";
import * as civo from "@pulumi/civo";

const clusterName = pulumi.getStack();

export const createCluster = (firewall: pulumi.Output<string>) => {
  return new civo.KubernetesCluster(
    clusterName,
    {
      region: "lon1",
      pools: {
        size: "g4s.kube.medium",
        nodeCount: 3,
      },
      firewallId: firewall,
    },
    {
      ignoreChanges: ["version", "pools.nodeCount"],
    }
  );
};

// export const clusterNameCivo = createCluster.name
// export const kcCivo = createCluster.kubeconfig
