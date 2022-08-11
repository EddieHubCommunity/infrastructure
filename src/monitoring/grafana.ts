import * as kubernetes from "@pulumi/kubernetes";

export const deployGrafana = (
  name: string,
  kubernetesProvider: kubernetes.Provider
) => {
  // helm repo add grafana https://grafana.github.io/helm-charts
  return new kubernetes.helm.v3.Release(
    name,
    {
      chart: "grafana",
      repositoryOpts: {
        repo: "https://grafana.github.io/helm-charts",
      },
      values: {
        persistence: {
          enabled: true,
        },
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
};
