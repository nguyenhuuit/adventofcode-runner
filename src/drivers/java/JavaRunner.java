import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.io.File;
import java.io.FileWriter;
import java.lang.reflect.Method;
import java.net.URL;
import com.google.gson.Gson;

class JavaRunner
{
    public static void main(String []args)
    {
        try {
            File file = new File(".");
            URL url = file.toURI().toURL();
            URL[] urls = new URL[]{url};
            ClassLoader cl = new URLClassLoader(urls);
            Class<?> cls = cl.loadClass("Solution");
            Method method = cls.getMethod("solve", String.class);

            String input = Files.readString(Path.of(args[0]));

            long start = System.currentTimeMillis();
            Object result = method.invoke(null, input);
            long finish = System.currentTimeMillis();
            long timeElapsed = finish - start;

            Gson gson = new Gson();
            Map<String, Object> stringMap = new LinkedHashMap<>();
            stringMap.put("result", result);
            stringMap.put("time", timeElapsed + "ms");

            String json = gson.toJson(stringMap);
            
            FileWriter myWriter = new FileWriter("/dev/fd/3");
            myWriter.write(json + "\n");
            myWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
};