import { readdir } from "fs/promises";
import { camelCase, upperFirst } from "lodash-es";
import Generator from "yeoman-generator";
import root from "../../../../package.json" with { type: "json" };

const scope = "@postinumero";

export default class extends Generator {
  async prompting() {
    this.props = await this.prompt([
      {
        type: "list",
        name: "type",
        message: "Package type?",
        choices: await readdir(this.templatePath()),
      },
      {
        type: "input",
        name: "name",
        message: `Package name? (${scope} scope can be omitted here)`,
        validate(value) {
          if (value.startsWith("@")) {
            if (!value.startsWith(`${scope}/`)) {
              return `Please enter a valid package name. Only ${scope} scope is allowed.`;
            }
          }

          if (!value.length) {
            return "Please enter a valid package name. Package name cannot be empty.";
          }

          return true;
        },
      },
      {
        type: "input",
        name: "license",
        message: "License?",
        default: root.license,
      },
      {
        type: "input",
        name: "author.name",
        message: "Author name?",
        default: root.author.name,
      },
      {
        type: "input",
        name: "author.email",
        message: "Author email?",
        default: root.author.email,
      },
    ]);
  }

  writing() {
    const { props } = this;

    if (props.name.startsWith(`${scope}/`)) {
      props.path = props.name.split("/")[1];
    } else {
      props.path = props.name;
      props.name = `${scope}/${props.path}`;
    }
    props.variableName = camelCase(props.path);
    props.classOrComponentName = upperFirst(props.variableName);

    this.destinationRoot(`packages/${props.name.split("/")[1]}`);

    this.fs.copyTpl(
      this.templatePath(`${props.type}`),
      this.destinationPath(),
      props,
      null,
      { globOptions: { dot: true } },
    );

    if (props.type === "react-component-typescript") {
      this.fs.move(
        this.destinationPath("src/Main.tsx"),
        this.destinationPath(`src/${props.classOrComponentName}.tsx`),
      );
    }
  }
}
