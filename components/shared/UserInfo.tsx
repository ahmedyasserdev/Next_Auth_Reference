import { ExtendeUser } from "@/next-auth";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

type UserInfoProps = {
  user?: ExtendeUser;
  label: String;
};

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl  font-semibold text-center">{label}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-row  items-center justify-between  flex-wrap border p-3 rounded-lg  shadow-sm">
          {user &&
            Object.entries(user)
              .filter(
                ([key, value]) =>
                  value !== undefined &&
                  value !== null &&
                  value !== "" &&
                  key !== "image"
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-row items-center justify-between w-full p-2 border-b"
                >
                  <p className="text-sm font-medium capitalize">{key} :</p>
                  {key === "isTwoFactorEnabled" ? (
                    <Badge variant = {value ? "success" : "destructive"}>
                      {value === true ? "ON" : "OFF"}
                    </Badge>
                  ) : (
                    <p className="truncate max-w-[180px] text-xs font-mono">
                      {value}
                    </p>
                  )}
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
