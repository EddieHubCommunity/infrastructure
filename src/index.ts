import domain from "./networking/domain";
import { kubernetesProvider } from "./kubernetes/cluster";
import spaces from "./spaces/spaces";
import nginx from "./networking/nginx";

const name = "eddiehub";
const url = "eddiehub.io";

domain(name, url);
nginx(kubernetesProvider);
spaces(name, url);
