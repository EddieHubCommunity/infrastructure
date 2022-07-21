import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

export const deployIngressController = (
  provider: kubernetes.Provider,
  loadBalancer: digitalocean.LoadBalancer
) => {
  const ingressDeploy = new kubernetes.helm.v3.Release(
    "nginx-ignress",
    {
      chart: "ingress-nginx",
      repositoryOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
      },
      values: {
        controller: {
          service: {
            type: "LoadBalancer",
            annotations: {
              "kubernetes.digitalocean.com/load-balancer-id": loadBalancer.id,
            },
          },
        },
      },
    },
    {
      provider,
    }
  );
};
