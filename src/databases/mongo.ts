// https://artifacthub.io/packages/helm/bitnami/mongodb
// helm repo add bitnami https://charts.bitnami.com/bitnami
import * as kubernetes from "@pulumi/kubernetes";

export const deployMongoDBCluster = (
  name: string,
  provider: kubernetes.Provider
) =>
  new kubernetes.helm.v3.Release(
    name,
    {
      chart: "mongodb",
      repositoryOpts: {
        repo: "https://charts.bitnami.com/bitnami",
      },
      values: {
        persistence: {
          name: "mongo-data",
          size: "5Gi",
        },
      },
    },
    {
      provider,
    }
  );
