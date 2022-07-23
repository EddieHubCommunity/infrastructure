import * as k8s from "@pulumi/kubernetes";
import { CustomResource } from "@pulumi/pulumi";

const apiApp = (
  kubernetesProvider,
  secretsResource,
  dependsOn: CustomResource[] = []
) => {
  const api = new k8s.yaml.ConfigGroup(
    "api",
    {
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/api/infrastructure/kubernetes/deployment.yaml", // TODO: back to main branch
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/ingress.yaml",
      ],
    },
    {
      provider: kubernetesProvider,
      dependsOn: [
        kubernetesProvider,
        secretsResource.GH_TOKEN,
        secretsResource.API_WEBHOOK_SECRET,
        secretsResource.APPROVED_TOKENS,
        // TODO: Mongo dynamic connection string?
        ...dependsOn,
      ],
    }
  );
  return api;
};

export default apiApp;
