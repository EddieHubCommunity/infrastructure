import * as k8s from "@pulumi/kubernetes";

// linkfree.eddiehubcommunity.org
// linkfree.eddiehub.io

const linkfreeConfig = (kubernetesProvider) => {
  const linkfree = new k8s.yaml.ConfigGroup(
    "LinkFree",
    {
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/ingress.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/LinkFree/main/kubernetes/deployment.yaml",
      ],
    },
    {
      provider: kubernetesProvider,
    }
  );
  return linkfree;
};

export default linkfreeConfig;
