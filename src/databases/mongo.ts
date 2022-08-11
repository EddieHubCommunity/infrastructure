// https://artifacthub.io/packages/helm/bitnami/mongodb
// helm repo add bitnami https://charts.bitnami.com/bitnami
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as random from "@pulumi/random";

interface MongoDB {
  secretName: pulumi.Output<string>;
  serviceName: string | pulumi.Outpk=ut<string>;
}

export const deployMongoDBCluster = (
  name: string,
  provider: kubernetes.Provider
): MongoDB => {
  const replicaSetKey = new random.RandomPassword("mongodb-replicaset-key", {
    length: 32,
  });

  const rootPassword = new random.RandomPassword("mongodb-root-password", {
    length: 32,
  });

  const userName = new random.RandomPet("mongodb-user-name", {
    length: 8,
  });

  const userPassword = new random.RandomPassword("mongodb-user-password", {
    length: 32,
  });

  const mongoDbCredentialSecret = new kubernetes.core.v1.Secret(
    "mongodb-credentials",
    {
      metadata: {
        name: "mongodb-credentials",
      },
      data: {
        "mongodb-root-password": rootPassword.result.apply((result) =>
          Buffer.from(result).toString("base64")
        ),
        "mongodb-username": userName.id.apply((id) =>
          Buffer.from(id).toString("base64")
        ),
        "mongodb-password": userPassword.result.apply((result) =>
          Buffer.from(result).toString("base64")
        ),
        "mongodb-replica-set-key": replicaSetKey.result.apply((result) =>
          Buffer.from(result).toString("base64")
        ),
      },
    },
    {
      provider,
    }
  );

  const serviceName = "mongodb";

  // Existing secret with MongoDB(®) credentials (keys: mongodb-passwords, mongodb-root-password, mongodb-metrics-password, mongodb-replica-set-key)
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
        fullnameOverride: "mongodb",
        service: {
          nameOverride: serviceName,
        },
        auth: {
          existingSecret: mongoDbCredentialSecret.metadata.name,
        },
      },
    },
    {
      provider,
    }
  );

  return {
    secretName: mongoDbCredentialSecret.metadata.name,
    serviceName,
  };
};
