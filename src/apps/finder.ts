import * as k8s from "@pulumi/kubernetes";

export const finderApp = (kubernetesProvider, secretsResource) => {
  const finder = new k8s.yaml.ConfigGroup(
    "Finder",
    {
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/good-first-issue-finder/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/good-first-issue-finder/main/kubernetes/deployment.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/good-first-issue-finder/main/kubernetes/ingress.yaml",
      ],
    },
    {
      provider: kubernetesProvider,
      dependsOn: [kubernetesProvider, secretsResource.GH_TOKEN],
    }
  );
  return finder;
};
