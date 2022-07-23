import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const secrets = (kubernetesProvider) => {
  const GH_TOKEN = new k8s.core.v1.Secret(
    "gh-token",
    {
      metadata: {
        name: "gh-token",
      },
      stringData: {
        GH_TOKEN: config.requireSecret("GH_TOKEN"),
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
  const API_MONGO_USERNAME = new k8s.core.v1.Secret(
    "api-mongo-username",
    {
      metadata: {
        name: "api-mongo-username",
      },
      stringData: {
        API_MONGO_USERNAME: config.requireSecret("API_MONGO_USERNAME"),
      },
    },
    {
      provider: kubernetesProvider,
    }
  );
  const API_MONGO_PASSWORD = new k8s.core.v1.Secret(
    "api-mongo-password",
    {
      metadata: {
        name: "api-mongo-password",
      },
      stringData: {
        API_MONGO_PASSWORD: config.requireSecret("API_MONGO_PASSWORD"),
      },
    },
    {
      provider: kubernetesProvider,
    }
  );

  return {
    GH_TOKEN,
    API_WEBHOOK_SECRET,
    APPROVED_TOKENS,
    API_MONGO_USERNAME,
    API_MONGO_PASSWORD,
  };
};

export default secrets;
