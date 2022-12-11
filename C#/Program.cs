using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Linq;

class WebRequests
{	
	public static void Main(string[] args)
	{
		int times = Array.IndexOf(args, "-t") > -1 ? int.Parse(args[Array.IndexOf(args, "-t") + 1]) : 3000;
		string[] protocols = Array.IndexOf(args, "-p") > -1 ? args[Array.IndexOf(args, "-p") + 1].Split(",") : new string[]{"http"};
		string[] domains = Array.IndexOf(args, "-d") > -1 ? args[Array.IndexOf(args, "-d") + 1].Split(",") : new string[]{".co", ".com", ".net", ".edu", ".gov", ".cn", ".org", ".cc", ".us", ".mil", ".ac", ".it", ".de"};
		int second = Array.IndexOf(args, "-s") > -1 ? int.Parse(args[Array.IndexOf(args, "-s") + 1]) : 1;
		bool log = Array.IndexOf(args, "-l") > -1;
		int min = Array.IndexOf(args, "-MIN") > -1 ? int.Parse(args[Array.IndexOf(args, "-MIN") + 1]) : 2;
		int max = Array.IndexOf(args, "-MAX") > -1 ? int.Parse(args[Array.IndexOf(args, "-MAX") + 1]) : 50;

		DateTime time = DateTime.Now;

		Console.WriteLine($"\nI am going to look for websites through {times} random URLs (min length {min} and max length {max}) with the following domains: {String.Join(", ", domains)}");
		Console.WriteLine($"These URLs will use the protocols {String.Join(", ", protocols)} and each of those URLs have {second} in a 100 chance to have a second level domain.");
		Console.WriteLine($"Started at {time.Hour}h{time.Minute}m\n");

		List<data> _data = new List<data>();

		for (int i = 0; i < times; i++)
		{

			string url = RandomURL(domains, protocols, min, max, second);
			if (log) Console.WriteLine($"{url} ({i+1}/{times})");

			try
			{
				WebRequest request = WebRequest.Create(url);
				request.Credentials = CredentialCache.DefaultCredentials;
				HttpWebResponse response = (HttpWebResponse)request.GetResponse();
				// exists, save url and response
				Console.WriteLine($"{url} exists! {response.StatusDescription}");
				_data.Add(new data()
				{
					website_url = url,
					response_type = "SUCCESS",
					response_code = $"{(int)response.StatusCode}",
					response_details = response.StatusDescription
				});
				response.Close();
			}
			catch (System.Net.WebException e)
			{	
				if (e.InnerException != null)
				{
					if (e.InnerException.InnerException != null)
					{
						if (e.InnerException.InnerException.GetType() != typeof(System.Net.Sockets.SocketException))
						{ // exists, save url and exception
							Console.WriteLine($"{url} exists! {e.InnerException.InnerException.GetType()}");
							_data.Add(new data()
							{
								website_url = url,
								response_type = "ERROR",
								response_code = "UNKNOWN", // Haven't found out if there is a way to get the response code from host
								response_details = $"{e.InnerException.InnerException.GetType()} | {e.Message}"
							});
						}
					}
				}
			}
		}

		string json_file_name = $"C#_report_{time.Day}{time.Hour}{time.Minute}.json";
		string json = JsonSerializer.Serialize(_data);
		File.WriteAllText(json_file_name, json);
	}

	public class data
	{
		public string website_url {get; set;}
		public string response_type {get; set;}
		public string response_code {get; set;}
		public string response_details {get; set;}
	}

	private static Random random = new Random();
	public static string RandomURL(string[] d, string[] p, int min, int max, int second)
	{
		const string chars = "abcdefghijklmnopqrstuvwyxz0123456789";

		string full_url = p[random.Next(m.Length)] + "://"; // protocols (http/https)
		full_url += new string (Enumerable.Repeat(chars, random.Next(min, max))
		.Select(s => s[random.Next(s.Length)]).ToArray()); // Domain name (abc69)
		full_url += d[random.Next(d.Length)]; // Top-level domain (.fr)
		if (random.Next(100) <= second) full_url += d[random.Next(d.Length)]; // Second-level domain (.co)
		return full_url;
	}
}
