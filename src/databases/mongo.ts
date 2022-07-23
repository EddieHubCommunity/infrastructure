// https://artifacthub.io/packages/helm/bitnami/mongodb
// helm repo add bitnami https://charts.bitnami.com/bitnami
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

const config = new pulumi.Config();

export const deployMongoDBCluster = (
  name: string,
  provider: kubernetes.Provider,
  secrets
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
        auth: {
          usernames: [config.requireSecret("API_MONGO_USERNAME")],
          passwords: [config.requireSecret("API_MONGO_PASSWORD")],
          databases: ["api"],
        },
      },
    },
    {
      provider,
      dependsOn: [secrets.API_MONGO_USERNAME, secrets.API_MONGO_PASSWORD],
    }
  );
