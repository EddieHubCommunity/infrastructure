import * as pulumi from "@pulumi/pulumi";
import * as civo from "@pulumi/civo";

interface Config {
  name: string;
  region: string;
  mainPool: {
    size: string;
    nodeCount: number;
  };
}

interface Response {
  kubeconfig: pulumi.Output<string>;
}

export const createCluster = (config: Config): Response => {
  const firewall = new civo.Firewall(config.name, {
    region: config.region,
    createDefaultRules: true,
  });

  const cluster = new civo.KubernetesCluster(config.name, {
    region: config.region,
    pools: config.mainPool,
    firewallId: firewall.id,
  });

  return {
    kubeconfig: cluster.kubeconfig,
  };
};
