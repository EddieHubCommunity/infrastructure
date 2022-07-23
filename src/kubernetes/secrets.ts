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

  return { GH_TOKEN };
};

export default secrets;
