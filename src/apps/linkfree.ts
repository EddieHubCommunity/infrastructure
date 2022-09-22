import * as k8s from "@pulumi/kubernetes";

export const deployLinkFree = (kubernetesProvider) => {
  return new k8s.yaml.ConfigGroup(
    "LinkFree",
    {
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/deployment.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/ingress.yaml",
      ],
    },
    {
      provider: kubernetesProvider,
      dependsOn: [kubernetesProvider],
    }
  );
};
