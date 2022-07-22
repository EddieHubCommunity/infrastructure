import * as k8s from "@pulumi/kubernetes";

const apiApp = (kubernetesProvider) => {
  const api = new k8s.yaml.ConfigGroup(
    "api",
    {
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/deployment.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/ingress.yaml",
      ],
    },
    {
      provider: kubernetesProvider,
    }
  );
  return api;
};

export default apiApp;
