import * as kubernetes from "@pulumi/kubernetes";

export const deployLoki = (
  name: string,
  kubernetesProvider: kubernetes.Provider
) => {
  return new kubernetes.helm.v3.Release(
    `loki-${name}`,
    {
      chart: "loki-distributed",
      repositoryOpts: {
        repo: "https://grafana.github.io/helm-charts",
      },
      values: {
        fullnameOverride: "loki",
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
};
