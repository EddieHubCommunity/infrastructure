import * as kubernetes from "@pulumi/kubernetes";

export const deployPromTail = (
  name: string,
  kubernetesProvider: kubernetes.Provider
) => {
  return new kubernetes.helm.v3.Release(
    `promtail-${name}`,
    {
      chart: "promtail",
      repositoryOpts: {
        repo: "https://grafana.github.io/helm-charts",
      },
      values: {
        loki: {
          serviceName: "loki-production-6902ff4b", // TODO: get this dynamically
        },
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
};
