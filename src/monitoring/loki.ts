import * as kubernetes from "@pulumi/kubernetes";

export const deployLoki = (
  name: string,
  kubernetesProvider: kubernetes.Provider
) => {
  return new kubernetes.helm.v3.Release(
    `loki-${name}`,
    {
      chart: "loki",
      repositoryOpts: {
        repo: "https://grafana.github.io/helm-charts",
      },
      values: {
        // TODO: We don't really want to override the name or port,
        // insetad we'd rather understand how to configure promtail
        // the docs are incorrect!
        fullnameOverride: "loki-gateway",
        service: {
          port: "80",
        },
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
