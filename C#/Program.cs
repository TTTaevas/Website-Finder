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
	public static void Main()
	{
		int times = 3000;
		string[] domains = new string[]{".co", ".com", ".net", ".edu", ".gov", ".cn", ".org", ".cc", ".us", ".mil", ".ac", ".it", ".de"};
		string[] mode = new string[]{"http", "https"};
		bool log = true;
		int mini = 2;
		int maxi = 50;
		int second = 1;

		List<data> _data = new List<data>();

		for (int i = 0; i < times; i++)
		{

			string url = RandomURL(domains, mode, mini, maxi, second);
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

		string json = JsonSerializer.Serialize(_data);
		File.WriteAllText("C#_report.json", json);
	}

	public class data
	{
		public string website_url {get; set;}
		public string response_type {get; set;}
		public string response_code {get; set;}
		public string response_details {get; set;}
	}

	private static Random random = new Random();
	public static string RandomURL(string[] d, string[] m, int mini, int maxi, int second)
	{
		const string chars = "abcdefghijklmnopqrstuvwyxz0123456789";

		string full_url = m[random.Next(m.Length)] + "://"; // Mode (http/https)
		full_url += new string (Enumerable.Repeat(chars, random.Next(mini, maxi))
		.Select(s => s[random.Next(s.Length)]).ToArray()); // Domain name (abc69)
		full_url += d[random.Next(d.Length)]; // Top-level domain (.fr)
		if (random.Next(100) <= second) full_url += d[random.Next(d.Length)]; // Second-level domain (.co)
		return full_url;
	}
}
