import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const secrets = (kubernetesProvider) => {
  const API_MONGO_CONNECTION_STRING = new k8s.core.v1.Secret(
    "api-mongo-connection-string",
    {
      metadata: {
        name: "api-mongo-connection-string",
      },
      stringData: {
        API_MONGO_CONNECTION_STRING: "", // TODO: mongo service name?
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
  const API_WEBHOOK_SECRET = new k8s.core.v1.Secret(
    "api-webhook-secret",
    {
      metadata: {
        name: "api-webhook-secret",
      },
      stringData: {
        API_WEBHOOK_SECRET: config.requireSecret("API_WEBHOOK_SECRET"),
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
  const APPROVED_TOKENS = new k8s.core.v1.Secret(
    "approved-tokens",
    {
      metadata: {
        name: "approved-tokens",
      },
      stringData: {
        APPROVED_TOKENS: config.requireSecret("APPROVED_TOKENS"),
      },
    },
    {
      provider: kubernetesProvider,
    }
  );

  return {
    API_MONGO_CONNECTION_STRING,
    API_WEBHOOK_SECRET,
    APPROVED_TOKENS,
  };
};

export default secrets;
