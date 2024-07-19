
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./BackButton";
import Header from "./Header";
import Socials from "./Socials";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};
const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocials,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}

      <CardFooter>
          <BackButton 
            href = {backButtonHref}
            label = {backButtonLabel}
          />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
