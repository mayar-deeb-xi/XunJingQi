import { bottomLinks, copyright } from '@acme/white-label/web-app';

export const AppFooter = () => {
  return (
    <div className=" hidden md:flex sticky bottom-0 px-4 bg-blur-3xl backdrop-blur-md border-t border-foreground/20  flex-col justify-between text-xs  py-0.5  md:flex-row md:items-center">
      <p>{copyright}</p>
      <ul className="flex gap-4">
        {bottomLinks.map((link, linkIdx) => (
          <li key={linkIdx} className="hover:text-primary underline">
            <a href={link.url}>{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
